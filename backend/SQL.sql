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

SELECT users.username, reviews.service, reviews.star, reviews.text
FROM users
INNER JOIN reviews ON reviews.user_id=users.id;

ALTER TABLE reviews
ADD user_id INT;

ALTER TABLE reviews
DROP COLUMN username;

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

--Review table

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT references users(id),
    service TEXT NOT NULL,
    star INT NOT NULL,
    text VARCHAR(255) NOT NULL
);

INSERT INTO reviews VALUES(
    1,
    13,
    'pet-sitting',
    4,
    'Good Service. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    2,
    9,
    'dog-walking',
    5,
    'Very Nice. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    3,
    15,
    'pets-grooming',
    5,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    4,
    44,
    'pets-ride',
    5,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    5,
    'bingor',
    'pet-sitting',
    4,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    6,
    'Lup Lup',
    'pets-grooming',
    5,
    'Nice Job! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    7,
    'Shu Jai',
    'pets-grooming',
    4,
    'Well done! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    8,
    'Gum Jai',
    'pets-ride',
    5,
    'Happy with your service! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    9,
    'Fei Jai',
    'dog-walking',
    4,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    10,
    'Dau Chu',
    'dog-walking',
    4,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.',
    13
);

INSERT INTO reviews VALUES(
    11,
    'Bak Bak',
    'pet-sitting',
    5,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.',
    9
);