require("dotenv").config();
const express = require("express");
const { Client } = require('pg');
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");
const path = require("path");
const session = require("express-session");

const saltRounds = 10;

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

    /*******************Log In & Register***********************/

    app.post("/login", async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) throw new Error('missing email/password.');

            const { email, password } = req.body;

            const foundUser = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (foundUser.rows.length) {
                const { id, username, password: passwordInDB } = foundUser.rows[0];
                const match = await bcrypt.compare(password, passwordInDB);
                if (match) {
                    req.session.user = { id };
                    res.json({ username });

                } else {
                    throw new Error('Incorrect username/password.')
                }
            } else {
                throw new Error('user not found');
            }
        } catch (err) {
            alert('Log in failed. Please try again.');
            res.status(500).json({ message: err.message });

        }
    });

    app.post("/register", async (req, res) => {
        const username = req.body.username;
        const email = req.body.email;

        try {
            const hashedPw = await bcrypt.hash(req.body.password, saltRounds);

            const newUser = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
            const input = [username, email, hashedPw];

            const register = await client.query(newUser, input);

            if (register.rows.length) {
                res.sendStatus(register.rows[0].id);
            }
        } catch (err) {
            console.log(err);
        }
    });

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

            const newRide = 'INSERT INTO ride(date, time, pickup, dropoff, numberofpets) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const inputRide = [date4, time4, pickUp4, dropOff4, numberOfPets4]
            const bookRide = await client.query(newRide, inputRide);
            console.log(bookRide.rows[0]);
            res.redirect('http://127.0.0.1:3000/html/success.html')

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

            const newGrooming = 'INSERT INTO grooming(date, time, numberofpets) VALUES($1, $2, $3) RETURNING *';
            const inputGrooming = [date3, time3, numberOfPets3]
            const bookGrooming = await client.query(newGrooming, inputGrooming);
            console.log(bookGrooming.rows[0]);
            res.redirect('http://127.0.0.1:3000/html/success.html')

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

            const newSitting = 'INSERT INTO sitting (date, time, frequency, location, numberofpets, district) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const inputSitting = [date1, time1, frequency1, location1, numberOfPets1, district1]
            const bookSitting = await client.query(newSitting, inputSitting);
            console.log(bookSitting.rows[0]);
            res.redirect('http://127.0.0.1:3000/html/success.html')

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


            const newWalking = 'INSERT INTO walking(date, time, frequency, duration, numberofpets) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const inputWalking = [date2, time2, frequency2, duration2, numberOfPets2]
            const bookWalking = await client.query(newWalking, inputWalking);
            console.log(bookWalking.rows[0]);
            res.redirect('http://127.0.0.1:3000/html/success.html')

        } catch (err) {
            console.log(err);
        }
    });


    //Use static file
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