const express = require("express");
const { Client } = require('pg');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

(async () => {
    const app = express();
    const client = new Client({
        database: 'pawtners'
    })
    await client.connect()

    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: false }));

    /**********************Routes*****************************/

    app.get('/healthcheck', (req, res) => {
        res.send('OK')
    });









    /*******************Log In & Register***********************/

    app.post("/login", async (req, res) => {
        const { email, password } = req.body;

        const foundUser = await client.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password]);

        if (foundUser.rows.length) {
            const foundUsername = foundUser.rows[0].username;
            res.send('Log in successful! Welcome back, ' + foundUsername + '.');
        } else {
            res.send('unable to find record');
        }
    });


    app.post("/register", async (req, res) => {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
        const input = [username, email, password];

        try {
            const register = await client.query(newUser, input);
            const newUsername = register.rows[0].username;

            res.send('Register successful! Hi, ' + newUsername + '.');

        } catch (err) {
            console.log(err);
        }
    });




app.listen(3001, (req, res) => {
    console.log("server started at port 3001");
});
}) ()