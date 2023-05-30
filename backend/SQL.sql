draw SQL = https://drawsql.app/teams/stephs-team-2/diagrams/pawtners

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email TEXT NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

--Pets ride

CREATE TABLE ride (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    pickup VARCHAR(255) NOT NULL,
    dropoff VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Grooming 

CREATE TABLE grooming (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Sitting
CREATE TABLE sitting (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NULL,
    location VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    user_id INT NOT NULL
);

--Walking

CREATE TABLE walking (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NULL,
    duration VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Contact Form

CREATE TABLE contact (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
message VARCHAR(255) NOT NULL
);

-- ALTER TABLE sitting
-- ADD user_id INT;

-- ALTER TABLE ride
-- DROP COLUMN username;

-- ALTER TABLE users
-- RENAME COLUMN id to user_id;

-- ALTER TABLE walking
-- RENAME COLUMN id to walking_order_id;

-- SELECT ride.date, ride.time, ride.pickup, ride.dropoff, ride.numberofpets, users.username
-- FROM ride
-- INNER JOIN users ON users.user_id=ride.user_id;

--Create Pawtners details

CREATE TABLE staff (
    pawtner_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email email NOT NULL UNIQUE,
    district VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    services VARCHAR(255) NOT NULL   
);

INSERT INTO staff VALUES (
    1,
    'steph',
    'steph@123.com',
    'Wan Chai',
    '2 years',
    'grooming & pet sitting'
);

INSERT INTO staff VALUES (
    2,
    'Avis',
    'avis@123.com',
    'Wan Chai',
    '1 years',
    'grooming'
);

INSERT INTO staff VALUES (
    3,
    'Jack',
    'jack@123.com',
    'Sha Tin',
    '1 years',
    'grooming'
);

UPDATE staff
SET district = 'sha-tin'
WHERE pawtner_id = 3;