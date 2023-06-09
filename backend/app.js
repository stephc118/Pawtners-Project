require("dotenv").config();
const express = require("express");
const { Client } = require('pg');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
const session = require("express-session");
const grant = require('grant');
const { bookingRoutes } = require("./api/booking");

(async () => {

    const app = express();

    const client = new Client({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'pawtners',
    })
    await client.connect()

    app.use((req, res, next) => {
        req.client = client;
        next();
    })

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
                    throw new Error('Incorrect username/password.')
                }
            } else {
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
                    throw new Error('Registration failed, please try again.');
                }
            } else {
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

    /****************************Contact Form*******************/

    app.post('/contact', async (req, res) => {
        try {
            const { name, email, message } = req.body;
            const query = 'INSERT INTO contact (name, email, message) VALUES ($1, $2, $3) RETURNING *';
            const newContact = await client.query(query, [name, email, message]);
            res.redirect('/index.html')
            console.log(newContact.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    })

    /***************************Account Page********************/

    app.get('/history', async(req, res) => {
        try {
            const userId = req.session.user.id;  
            const ride = await client.query(`
            SELECT ride2.date, ride2.pickup, ride2.dropoff, ride2.numberofpets, ride2.booking_id, booking.created_at, booking.status
            FROM ride2
            INNER JOIN booking ON ride2.booking_id=booking.id where booking.user_id = $1`, [userId]);

            const sitting = await client.query(`
            SELECT sitting2.date, sitting2.frequency, sitting2.location, sitting2.numberofpets, sitting2.district, sitting2.booking_id, booking.created_at, booking.status
            FROM sitting2
            INNER JOIN booking ON sitting2.booking_id=booking.id where booking.user_id = $1`, [userId]);

            const grooming = await client.query(`
            SELECT grooming2.date, grooming2.numberofpets, grooming2.booking_id, booking.created_at, booking.status
            FROM grooming2
            INNER JOIN booking ON grooming2.booking_id=booking.id where booking.user_id = $1`, [userId]);

            const walking = await client.query(`
            SELECT walking2.date, walking2.frequency, walking2.duration, walking2.numberofpets, walking2.booking_id, booking.created_at, booking.status
            FROM walking2
            INNER JOIN booking ON walking2.booking_id=booking.id where booking.user_id = $1`, [userId]);

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
    })

    app.use("/booking", bookingRoutes);

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