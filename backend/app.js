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
        database: 'pawtners'
    })
    await client.connect()


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


    app.use(session({
        secret: 'Thisispawtnerslittlesecret.',
        resave: false,
        saveUninitialized: false
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
                    res.json({ username: username });

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
                res.redirect('/booking.html')
                
                // res.json({ username: user.username });    
                // res.status(200);
                // res.json({username:user.username});
                // const username = sessionStorage.setItem('username', req.session.user.username);
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
            // const { id, username, email } = register.rows[0];
            const register = await client.query(newUser, input);

            if (register.rows.length) {
                req.session.user = { id: register.rows[0].id };
                res.json({ username: register.rows[0].username });
                // req.session.user = {id};
                // res.json({username, email});

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

//Handle Google account registration
// app.get('/login/google', async (req, res) => {
//     try {
//         const { email, username } = req.body;

//         //Create new user
//         const query =
//             'INSERT INTO google_users(name) VALUES ($1) RETURNING id';

//         const user = await client.query(query, [username]);

//         //Create new google account
//         const queryLocal =
//             'INSERT INTO google_users (google_id, email) VALUES ($1, $2)';

//         await client.query(queryLocal, [user.rows[0].id, email]);

//         //Add user id in our session
//         req.session['user'] = {
//             id: user.rows[0].user_id,
//         };

//         res.json({ message: 'successful' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error.⛔️' });
//     }
// });

/***********************LOG OUT***********************/

app.get("/logout", async (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) throw err;

        console.log('Destroyed session')

        // Clear the session cookie
        res.clearCookie('connect.sid');

        res.sendStatus(200);
    })
});
/********************Pets Ride Form***************************/

app.post("/ride-booking", async (req, res) => {
    try {
        const date4 = req.body.date4;
        const time4 = req.body.time4;
        const pickUp4 = req.body.pickup4;
        const dropOff4 = req.body.dropoff4;
        const numberOfPets4 = req.body.number4;
        const userId = req.session.user.id;

        const newRide = 'INSERT INTO ride(date, time, pickup, dropoff, numberofpets, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const inputRide = [date4, time4, pickUp4, dropOff4, numberOfPets4, userId]
        const bookRide = await client.query(newRide, inputRide);
        console.log(bookRide.rows[0]);
        res.redirect('/success.html')

    } catch (err) {
        console.log(err);
    }
});

/******************Pets Grooming Form**********************/

app.post("/grooming-booking", async (req, res) => {
    try {
        const date3 = req.body.date3;
        const time3 = req.body.time3;
        const numberOfPets3 = req.body.number3;
        const userId = req.session.user.id;

        const newGrooming = 'INSERT INTO grooming(date, time, numberofpets, user_id) VALUES($1, $2, $3, $4) RETURNING *';
        const inputGrooming = [date3, time3, numberOfPets3, userId]
        const bookGrooming = await client.query(newGrooming, inputGrooming);
        console.log(bookGrooming.rows[0]);
        res.redirect('/success.html')

    } catch (err) {
        console.log(err);
    }
});

/**********************Pet Sitting***************************/

app.post("/sitting-booking", async (req, res) => {
    try {
        const date1 = req.body.date1;
        const time1 = req.body.time1;
        const frequency1 = req.body.frequency1;
        const location1 = req.body.location1;
        const numberOfPets1 = req.body.number1;
        const district1 = req.body.district1;
        const userId = req.session.user.id;

        const newSitting = 'INSERT INTO sitting (date, time, frequency, location, numberofpets, district, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const inputSitting = [date1, time1, frequency1, location1, numberOfPets1, district1, userId]
        const bookSitting = await client.query(newSitting, inputSitting);
        console.log(bookSitting.rows[0]);
        res.redirect('/success.html')

    } catch (err) {
        console.log(err);
    }
});
/**********************Dog Walking***************************/

app.post("/walking-booking", async (req, res) => {
    try {
        const date2 = req.body.date2;
        const time2 = req.body.time2;
        const frequency2 = req.body.frequency2;
        const duration2 = req.body.duration2;
        const numberOfPets2 = req.body.number2;
        const userId = req.session.user.id;


        const newWalking = 'INSERT INTO walking(date, time, frequency, duration, numberofpets, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const inputWalking = [date2, time2, frequency2, duration2, numberOfPets2, userId]
        const bookWalking = await client.query(newWalking, inputWalking);
        console.log(bookWalking.rows[0]);
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
        console.log(newContact.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//Use static file
app.use(express.static(path.join(__dirname, '../public/html')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(isLoggedIn, express.static(path.join(__dirname, '../private'))); //server private page for logged in user
app.use(isLoggedIn, express.static(path.join(__dirname, '../public')));

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
}) ()