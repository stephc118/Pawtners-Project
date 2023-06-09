draw SQL = https://drawsql.app/teams/stephs-team-2/diagrams/pawtners

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

--Sitting
CREATE TABLE sitting (
    id SERIAL PRIMARY KEY,
    date timestamp NOT NULL,
    frequency INT NULL,
    location VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    created_ts timestamp DEFAULT NOW(),
    user_id INT references users(id)
);

--Walking

CREATE TABLE walking (
    id SERIAL PRIMARY KEY,
    date timestamp NOT NULL,
    frequency VARCHAR(255) NULL,
    duration INT NOT NULL,
    numberofpets INT NOT NULL,
    created_ts timestamp DEFAULT NOW(),
    user_id INT references users(id)
);

--Grooming 

CREATE TABLE grooming (
    id SERIAL PRIMARY KEY,
    date timestamp NOT NULL,
    -- plan VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    created_ts timestamp DEFAULT NOW(),
    user_id INT references users(id)
);

--Pets ride

CREATE TABLE ride (
    id SERIAL PRIMARY KEY,
    date timestamp NOT NULL,
    pickup VARCHAR(255) NOT NULL,
    dropoff VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    created_ts timestamp DEFAULT NOW(),
    user_id INT references users(id)
);

--Contact Form

CREATE TABLE contact (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
message VARCHAR(255) NOT NULL
);

--Create Pawtners details

CREATE TABLE staff (
    pawtner_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    district VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    services VARCHAR(255) NOT NULL   
);

-- ALTER TABLE sitting
-- ADD user_id INT;

-- ALTER TABLE ride
-- DROP COLUMN username;

-- ALTER TABLE sitting
-- RENAME COLUMN user_id to id;

-- ALTER TABLE ride
-- RENAME COLUMN ride_order_id to id;

-- SELECT ride.date, ride.time, ride.pickup, ride.dropoff, ride.numberofpets, users.username
-- FROM ride
-- INNER JOIN users ON users.user_id=ride.user_id;

-- INSERT INTO staff VALUES (
--     1,
--     'steph',
--     'steph@123.com',
--     'Wan Chai',
--     '2 years',
--     'grooming & pet sitting'
-- );

-- INSERT INTO staff VALUES (
--     2,
--     'Avis',
--     'avis@123.com',
--     'Wan Chai',
--     '1 years',
--     'grooming'
-- );

-- INSERT INTO staff VALUES (
--     3,
--     'Jack',
--     'jack@123.com',
--     'Sha Tin',
--     '1 years',
--     'grooming'
-- );

-- INSERT INTO staff VALUES (
--     4,
--     'Ivy',
--     'ivy@123.com',
--     'wan-chai',
--     '3 years',
--     'Dog Walking & Grooming'
-- );

-- INSERT INTO staff VALUES (
--     5,
--     'Rebecca',
--     'reb@123.com',
--     'wan-chai',
--     '2 years',
--     'Grooming & Pet Sitting'
-- );


-- UPDATE staff
-- SET district = 'sha-tin'
-- WHERE pawtner_id = 3;

/**************************NEW DB DESIGN**********************/

CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE sitting2 (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    frequency VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    service_id INT REFERENCES service(id),
    booking_id INT REFERENCES booking(id)
);

CREATE TABLE walking2 (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    frequency VARCHAR(255),
    duration VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    service_id INT REFERENCES service(id),
    booking_id INT REFERENCES booking(id)
);

CREATE TABLE grooming2 (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    numberofpets INT NOT NULL,
    service_id INT REFERENCES service(id),
    booking_id INT REFERENCES booking(id)
);

CREATE TABLE ride2 (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    pickup VARCHAR(255) NOT NULL,
    dropoff VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    service_id INT REFERENCES service(id),
    booking_id INT REFERENCES booking(id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    star INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    booking_id INT REFERENCES booking(id)
);


SELECT grooming2.date, grooming2.numberofpets, grooming2.booking_id, booking.user_id, grooming.created_at
FROM grooming2
INNER JOIN booking ON grooming2.booking_id=booking.id;

SELECT ride2.date, ride2.pickup, ride2.dropoff, ride2.numberofpets, ride2.booking_id, booking.created_at, booking.status
FROM ride2
INNER JOIN booking ON ride2.booking_id=booking.id;

SELECT sitting2.date, sitting2.frequency, sitting2.location, sitting2.numberofpets, sitting2.district, sitting2.booking_id, booking.created_at, booking.status
FROM sitting2
INNER JOIN booking ON sitting2.booking_id=booking.id;

SELECT walking2.date, walking2.frequency, walking2.duration, walking2.numberofpets, walking2.booking_id, booking.created_at, booking.status
FROM walking2
INNER JOIN booking ON walking2.booking_id=booking.id;
