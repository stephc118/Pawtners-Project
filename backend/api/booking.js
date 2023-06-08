const express = require('express');

const bookingRoutes = express.Router();

bookingRoutes.post("/ride", async (req, res) => {
    try {
        if ( !req.body.date || !req.body.time || !req.body.pickup || !req.body.dropoff || !req.body.numberOfPets ) {
            throw new Error('Please fill in all the fields.');
        }

        const client = req.client;
        const date = req.body.date;
        const time = req.body.time;
        const pickUp = req.body.pickup;
        const dropOff = req.body.dropoff;
        const numberOfPets = req.body.numberOfPets;
        const userId = req.session.user.id;

        if ( date && time && pickUp && dropOff && numberOfPets && userId ) {
            const newRide = 'INSERT INTO ride(date, time, pickup, dropoff, numberofpets, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const inputRide = [date, time, pickUp, dropOff, numberOfPets, userId]
            const bookRide = await client.query(newRide, inputRide);
            if (bookRide.rows.length) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
                throw new Error('Booking failed, please try again');
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

bookingRoutes.post("/grooming", async (req, res) => {
    try {
        if (!req.body.date || !req.body.time || !req.body.numberOfPets ) {
            throw new Error('Please fill in all the fields.');
        }

        const client = req.client;
        const date = req.body.date;
        const time = req.body.time;
        const numberOfPets = req.body.numberOfPets;
        const userId = req.session.user.id;
        
        if ( date && time && numberOfPets && userId) {
            const newGrooming = 'INSERT INTO grooming(date, time, numberofpets, user_id) VALUES($1, $2, $3, $4) RETURNING *';
            const inputGrooming = [date, time, numberOfPets, userId]
            const bookGrooming = await client.query(newGrooming, inputGrooming);
            if (bookGrooming.rows.length) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
                throw new Error('Booking failed, please try again');
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

bookingRoutes.post("/sitting", async (req, res) => {
    try {
        const planId = req.query.plan_id;

        if ( planId === 2 || planId === 3) {
            if (!req.body.frequency) throw new Error('Missing field');
        }

        if (!req.body.date
            || !req.body.time
            || !req.body.location
            || !req.body.numberOfPets
            || !req.body.district
        ) {
            throw new Error('Missing field');
        }

        const client = req.client;
        const date = req.body.date;
        const time = req.body.time;
        const frequency = req.body?.frequency || null;
        const location = req.body.location;
        const numberOfPets = req.body.numberOfPets;
        const district = req.body.district;
        const userId = req.session.user.id;

        const newSitting = 'INSERT INTO sitting (date, time, frequency, location, numberofpets, district, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const inputSitting = [date, time, frequency, location, numberOfPets, district, userId]
        const bookSitting = await client.query(newSitting, inputSitting);

        if (bookSitting.rows.length) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
            throw new Error('Booking failed, please try again');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

bookingRoutes.post("/walking", async (req, res) => {
    try {
        const client = req.client;
        const date = req.body.date;
        const time = req.body.time;
        const frequency = req.body.frequency;
        const duration = req.body.duration;
        const numberOfPets = req.body.number;
        const userId = req.session.user.id;


        const newWalking = 'INSERT INTO walking(date, time, frequency, duration, numberofpets, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const inputWalking = [date, time, frequency, duration, numberOfPets, userId]
        const bookWalking = await client.query(newWalking, inputWalking);
        console.log(bookWalking.rows[0]);
        res.redirect('/success.html')

    } catch (err) {
        console.log(err);
    }
})

module.exports = { bookingRoutes };