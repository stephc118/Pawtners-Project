require("dotenv").config();
const express = require("express");
const { Client } = require('pg');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
const session = require("express-session");
const grant = require('grant');

(async () => {

    const app = express();

    const client = new Client({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'pawtners',
    })
    await client.connect()


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(session({
        secret: 'Thisispawtnerslittlesecret.',
        resave: false,
        saveUninitialized: false,
        cookie: { path: '/', httpOnly: true, secure: false, maxAge: 900000}
    }));

    //Grant for OAuth login
    const grantExpress = grant.express({
        defaults: {
            origin: 'http://localhost:3000',
            transport: 'session',
            state: true,
        },
        google: {
            key: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
            scope: ['profile', 'email'],
            callback: '/login/google',
        },
    });

    app.use(grantExpress);

    /*******************LOG IN***********************/

    //Handle local Login
    app.post("/login", async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) throw new Error('missing email/password.');

            const { email, password } = req.body;

            const foundUser = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (foundUser.rows.length) {
                const { id, username, password: passwordInDB } = foundUser.rows[0];
                const match = await bcrypt.compare(password, passwordInDB);
                if (match) {
                    req.session.user = { id: id };
                    res.cookie('username', username);
                    res.sendStatus(200);

                } else {
                    res.sendStatus(400)
                    throw new Error('Incorrect username/password.')
                }
            } else {
                res.sendStatus(404);
                throw new Error('user not found');
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    //Handle Google Login
    app.get('/login/google', async (req, res) => {
        try {
            //Receive access token    
            const accessToken = req.session?.['grant'].response.access_token;

            //Fetching user information
            const fetchRes = await fetch(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const result = await fetchRes.json();

            //Check if email exist in our DB
            let user;
            const existingUser = (
                await client.query(
                    `SELECT * FROM users WHERE users.email = $1`,
                    [result.email]
                )
            );

            //Register for an account if no user was found
            if (existingUser.rows.length) {
                user = existingUser.rows[0];
            } else {
                const { name: username, email } = result;
                //Create new user
                const query = 'INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *';
                const newUser = await client.query(query, [username, email, 'passwordForGoogleUser']);
                user = newUser.rows[0];
            }

            //Add user id in our session
            if (user) {
                req.session.user = {
                    id: user.id,
                    username: user.username
                };
                res.cookie('username', user.username);
                res.redirect('/booking.html');
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error.⛔️' });
        }
    });

    /********************REGISTER*************************/

    //Handle local registration
    app.post("/register", async (req, res) => {
        try {
            if (!req.body.username || !req.body.email || !req.body.password) {
                throw new Error('missing username/email/password.');
            }
            const username = req.body.username;
            const email = req.body.email;

            const usedEmail = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (usedEmail.rows.length === 0 && !req.session.user) {
                const hashedPw = await bcrypt.hash(req.body.password, saltRounds);

                const newUser = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
                const input = [username, email, hashedPw];
                const register = await client.query(newUser, input);

                if (register.rows.length) {
                    req.session.user = { id: register.rows[0].id };
                    res.cookie('username', register.rows[0].username);
                    res.sendStatus(200);

                } else {
                    res.sendStatus(400);
                    throw new Error('Registration failed, please try again.');
                }
            } else {
                res.sendStatus(404);
                throw new Error('You have been logged in or this email has already been registered.')
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    /***********************LOG OUT***********************/

    app.get("/logout", async (req, res, next) => {
        req.session.destroy(function (err) {
            if (err) throw err;

            console.log('Destroyed session')

            // Clear the session cookie
            res.clearCookie('connect.sid');
            res.clearCookie('username');
            res.sendStatus(200);
        })
    });

    // TODO: field checking + login checking for form
    /********************Pets Ride Form***************************/

    app.post("/ride-booking", async (req, res) => {
        try {
            const date = req.body.date;
            const pickUp = req.body.pickup;
            const dropOff = req.body.dropoff;
            const numberOfPets = req.body.number;
            const userId = req.session.user.id;

            const newRide = 'INSERT INTO ride(date, pickup, dropoff, numberofpets, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const inputRide = [date, pickUp, dropOff, numberOfPets, userId]
            const bookRide = await client.query(newRide, inputRide);
            res.redirect('/success.html')

        } catch (err) {
            console.log(err);
        }
    });

    /******************Pets Grooming Form**********************/

    app.post("/grooming-booking", async (req, res) => {
        try {
            const date = req.body.date;
            const numberOfPets = req.body.number;
            const userId = req.session.user.id;

            const newGrooming = 'INSERT INTO grooming(date, numberofpets, user_id) VALUES($1, $2, $3) RETURNING *';
            const inputGrooming = [date, numberOfPets, userId]
            const bookGrooming = await client.query(newGrooming, inputGrooming);
            res.redirect('/success.html')

        } catch (err) {
            console.log(err);
        }
    });

    /**********************Pet Sitting***************************/

    app.post("/sitting-booking", async (req, res) => {
        try {
            const date = req.body.date;
            const frequency = req.body.frequency;
            const location = req.body.location;
            const numberOfPets = req.body.number;
            const district = req.body.district;
            const userId = req.session.user.id;

            const newSitting = 'INSERT INTO sitting (date, frequency, location, numberofpets, district, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const inputSitting = [date, frequency, location, numberOfPets, district, userId]
            const bookSitting = await client.query(newSitting, inputSitting);
            res.redirect('/success.html')

        } catch (err) {
            console.log(err);
        }
    });

    /**********************Dog Walking***************************/

    app.post("/walking-booking", async (req, res) => {
        try {
            const date = req.body.date;
            const frequency = req.body.frequency;
            const duration = req.body.duration;
            const numberOfPets = req.body.number;
            const userId = req.session.user.id;


            const newWalking = 'INSERT INTO walking(date, frequency, duration, numberofpets, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const inputWalking = [date, frequency, duration, numberOfPets, userId]
            const bookWalking = await client.query(newWalking, inputWalking);
            res.redirect('/success.html')

        } catch (err) {
            console.log(err);
        }
    });

    /****************************Contact Form*******************/

    app.post('/contact', async (req, res) => {
        try {
            const { name, email, message } = req.body;
            const query = 'INSERT INTO contact (name, email, message) VALUES ($1, $2, $3) RETURNING *';
            const newContact = await client.query(query, [name, email, message]);
            res.redirect('/index.html')
        } catch (err) {
            console.error(err.message);
        }
    })

    /***************************Account Page********************/

    app.get('/profile', async (req, res) => {
        try {
            const userId = req.session.user.id;  
            const profile = await client.query (`SELECT * FROM users where id = $1`, [userId]);
            if (profile.rows.length) {
                res.json({profile: profile.rows[0]});
            } else {
                res.json ({profile: []});
            }
        } catch (err) {
            console.log(err);
        }
    });

    app.get('/history', async(req, res) => {
        try {
            const userId = req.session.user.id;  
            const ride = await client.query('SELECT * from ride where user_id = $1', [userId]);
            const sitting = await client.query('SELECT * from sitting where user_id = $1', [userId]);
            const grooming = await client.query('SELECT * from grooming where user_id = $1', [userId]);
            const walking = await client.query('SELECT * from walking where user_id = $1', [userId]);

            if (!ride || !sitting || !grooming || !walking) {
                throw new Error('unable to get booking history from db');
            }

            res.json({
                orders: {
                    ride: ride.rows, 
                    sitting: sitting.rows, 
                    grooming: grooming.rows,
                    walking: walking.rows
                },
                total: ride.rows.length + sitting.rows.length + grooming.rows.length + walking.rows.length
            });

            // const booking = await client.query (
            //     ` 
            //         WITH sitting as ('SELECT * from ride where user_id = $1', [userId]),
            //         walking as ('SELECT * from walking where user_id = $1', [userId]),
            //         grooming as ('SELECT * from grooming where user_id = $1', [userId]),
            //         ride as ('SELECT * from ride where user_id = $1', [userId])
            //     `
            // )

            // if (booking.rows.length) {
            //     res.json ({booking: booking.rows});
            // } else {
            //     res.json ({booking: []});
            // }
        } catch (err) {
            console.log(err);
        }
    });

    /********************************District Page*********************/
    app.get('/district/:name', async (req, res) => {
        try {
            const { name } = req.params;
            const { limit, offset } = req.query;

            const staff = await client.query(
                `
                    WITH staff_count as (SELECT count(*) from staff where district = $1),
                    filtered_staff as (SELECT * from staff where district = $1 limit $2 offset $3)
                    SELECT * FROM filtered_staff, staff_count
                `,
                [name, limit, offset]
            );

            if (staff.rows.length) {
                const staffInfos = staff.rows.map(info => {
                    const {count, ...infoNeeded} = info;
                    return infoNeeded;
                })
                res.json ({staff: staffInfos, total: staff.rows[0].count});
            } else {
                res.json({staff: []});
            }
        } catch (err) {
            console.log(err);
            res.json({error: err.message})
        }
    });

     /*************************Reviews********************/

     app.get('/reviews/:service', async (req, res) => {
        try {
            const { service } = req.params;
            const { limit } = req.query;
            const review = await client.query(`SELECT * FROM reviews where service = $1 limit $2`, [service, limit]);
            if (review.rows.length) {
                res.json ({review: review.rows});
        
            } else {
                res.json ({review: []});
            }
        } catch (err) {
            console.log(err);
            res.json({error: err.message}) 
        }
     });

     app.post('/reviews', isLoggedIn, async (req, res) => {
        try {
            if ( !req.body.rating || !req.body.text ) {
                throw new Error ('Missing fields')
            }

            const username = req.session.user.username;
            const { service, rating, text } = req.body;
            
            const postReview = await client.query(`INSERT INTO reviews (username, service, star, text) VALUES ($1, $2, $3, $4) RETURNING *`,
            [username, service, rating, text])
            console.log(postReview.rows);
            if ( postReview.rows.length ) {
                res.sendStatus(200);
            }
        } catch (err) {
            console.log(err.message);
            res.json({error: err.message}) 
        }
     })
    /*************************Use static file********************/

    app.use(express.static(path.join(__dirname, '../public/html')));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(isLoggedIn, express.static(path.join(__dirname, '../private'))); //server private page for logged in user

    function isLoggedIn(req, res, next) {
        console.log(req.session);
        // implement check for user in session
        if (req.session?.user) {
            next();
        } else {
            console.log('user not found');
            res.redirect('not-login.html');
        }
    };

    /**********************Server start at port 3000****************/
    app.listen(3000, (req, res) => {
        console.log("server started at port 3000");
    });
})()