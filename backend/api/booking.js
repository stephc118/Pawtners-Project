const express = require('express');

const bookingRoutes = express.Router();

bookingRoutes.post("/ride", async (req, res) => {
    try {
        if ( !req.body.date 
            || !req.body.pickup 
            || !req.body.dropoff 
            || !req.body.numberOfPets 
        ) {
            throw new Error('Please fill in all the fields.');
        }

        const client = req.client;
        const date = req.body.date;
        const pickUp = req.body.pickup;
        const dropOff = req.body.dropoff;
        const numberOfPets = req.body.numberOfPets;
        const userId = req.session.user.id;
        const serviceId = 4;
        const status = "Pending";

        // Insert into booking table
        const newBooking = await client.query(`
            INSERT INTO booking(service_id, user_id, status) VALUES($1, $2, $3) RETURNING id`, [serviceId, userId, status]
        );
        // Get booking id from booking table's returning
        console.log(newBooking.rows[0].id);

        if (newBooking.rows.length) {
            // Insert booking id & booking details into ride table
            const newRide = 'INSERT INTO ride2(date, pickup, dropoff, numberofpets, service_id, booking_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const inputRide = [date, pickUp, dropOff, numberOfPets, serviceId, newBooking.rows[0].id]
            const bookRide = await client.query(newRide, inputRide);
            
            if (bookRide.rows.length) {
                res.sendStatus(200);
            } else {
                throw new Error('Booking failed, please try again');
            }
        } else {
            throw new Error('Booking failed, please try again');
        }       
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
})

bookingRoutes.post("/grooming", async (req, res) => {
    try {
        if (!req.body.date || !req.body.numberOfPets ) {
            throw new Error('Please fill in all the fields.');
        }

        const client = req.client;
        const date = req.body.date;
        const numberOfPets = req.body.numberOfPets;
        const userId = req.session.user.id;
        const serviceId = 3;
        const status = "Pending";
        
        // Insert into booking table
        const newBooking = await client.query(`
            INSERT INTO booking(service_id, user_id, status) VALUES($1, $2, $3) RETURNING id`, [serviceId, userId, status]
        );
       
        if (newBooking.rows.length) {
        
            // Get booking id from booking table's returning 
            console.log(newBooking.rows[0].id);

            // Insert booking id & booking details into grooming table
            const newGrooming = 'INSERT INTO grooming2(date, numberofpets, service_id, booking_id) VALUES($1, $2, $3, $4) RETURNING *';
            const inputGrooming = [date, numberOfPets, serviceId, newBooking.rows[0].id]
            const bookGrooming = await client.query(newGrooming, inputGrooming);

            if ( bookGrooming.rows.length) {
                res.sendStatus(200);
            } else {
                throw new Error('Booking failed, please try again');
            }
        } else {
            throw new Error('Booking failed, please try again');
        }    
    } catch (err) {
        console.log(err);
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
            || !req.body.location
            || !req.body.numberOfPets
            || !req.body.district
        ) {
            throw new Error('Missing field');
        }

        const client = req.client;
        const date = req.body.date;
        const frequency = req.body?.frequency || null;
        const location = req.body.location;
        const numberOfPets = req.body.numberOfPets;
        const district = req.body.district;
        const userId = req.session.user.id;
        const serviceId = 1;
        const status = "Pending";

        // Insert into booking table
        const newBooking = await client.query(`
            INSERT INTO booking(service_id, user_id, status) VALUES($1, $2, $3) RETURNING id`, [serviceId, userId, status]
        );

        if (newBooking.rows.length) {

            // Get booking id from booking table's returning 
            console.log(newBooking.rows[0].id);
            
             // Insert booking id & booking details into sitting table
            const newSitting = `
                INSERT INTO sitting2 (date, frequency, location, numberofpets, district, service_id, booking_id) 
                VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `;
            const inputSitting = [date, frequency, location, numberOfPets, district, serviceId, newBooking.rows[0].id]
            const bookSitting = await client.query(newSitting, inputSitting);
    
            if (bookSitting.rows.length) {
                res.sendStatus(200);
            } else {
                throw new Error('Booking failed, please try again');
            }
        } else {
            throw new Error('Booking failed, please try again');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
})

bookingRoutes.post("/walking", async (req, res) => {
    try {
        const planId = req.query.plan_id;

        if ( planId === 6 ) {
            if (!req.body.frequency) throw new Error('Missing field');
        }

        if (!req.body.date
            || !req.body.duration
            || !req.body.numberOfPets
        ) {
            throw new Error('Missing field');
        }

        const client = req.client;
        const date = req.body.date;
        const frequency = req.body?.frequency || null;
        const duration = req.body.duration;
        const numberOfPets = req.body.numberOfPets;
        const userId = req.session.user.id;
        const serviceId = 2;
        const status = "Pending";

        // Insert into booking table
            const newBooking = await client.query(`
            INSERT INTO booking(service_id, user_id, status) VALUES($1, $2, $3) RETURNING id`, [serviceId, userId, status]
        );

        if (newBooking.rows.length) {
            // Get booking id from booking table's returning 
            console.log(newBooking.rows[0].id);
            
             // Insert booking id & booking details into walking table
            const newWalking = 'INSERT INTO walking2(date, frequency, duration, numberofpets, service_id, booking_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const inputWalking = [date, frequency, duration, numberOfPets, serviceId, newBooking.rows[0].id]
            const bookWalking = await client.query(newWalking, inputWalking);
            if (bookWalking.rows.length) {
                res.sendStatus(200);
            } else {
                throw new Error('Booking failed, please try again');
            }
        } else {
            throw new Error('Booking failed, please try again');
        }   
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
})

module.exports = { bookingRoutes };