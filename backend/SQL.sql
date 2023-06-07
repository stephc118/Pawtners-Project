draw SQL = https://drawsql.app/teams/stephs-team-2/diagrams/pawtners

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email email NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

--Pets ride

CREATE TABLE ride (
    ride_order_id SERIAL PRIMARY KEY,
    date date NOT NULL,
    time time NOT NULL,
    pickup VARCHAR(255) NOT NULL,
    dropoff VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Grooming 

CREATE TABLE grooming (
    grooming_order_id SERIAL PRIMARY KEY,
    date date NOT NULL,
    time time NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Sitting
CREATE TABLE sitting (
    sitting_order_id SERIAL PRIMARY KEY,
    date date NOT NULL,
    time time NOT NULL,
    frequency VARCHAR(255) NULL,
    location VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    district VARCHAR(255) NOT NULL,
    user_id INT NOT NULL
);

--Walking

CREATE TABLE walking (
    walking_order_id SERIAL PRIMARY KEY,
    date date NOT NULL,
    time time NOT NULL,
    frequency VARCHAR(255) NULL,
    duration VARCHAR(255) NOT NULL,
    numberofpets INT NOT NULL,
    user_id INT NOT NULL
);

--Contact Form

CREATE TABLE contact (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email email NOT NULL,
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
    username VARCHAR(255) NOT NULL,
    service TEXT NOT NULL,
    star INT NOT NULL,
    text VARCHAR(255) NOT NULL
);

INSERT INTO reviews VALUES(
    1,
    'dau',
    'pet-sitting',
    4,
    'Good Service. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    2,
    'mung',
    'pet-sitting',
    5,
    'Very Nice. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    3,
    'bak',
    'pet-sitting',
    5,
    'Excellent! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.'
);

INSERT INTO reviews VALUES(
    4,
    'morgu',
    'dog-walking',
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