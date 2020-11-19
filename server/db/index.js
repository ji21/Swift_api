const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.db_password,
    database: 'sys'
  })

const createProfilesQuery = "CREATE TABLE IF NOT EXISTS Profiles(pid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20), age INT NOT NULL, gender VARCHAR(20))"
const createUsersQuery = "CREATE TABLE IF NOT EXISTS Users(uid INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20), password VARCHAR(255) NOT NULL, email VARCHAR(100), phone VARCHAR(50), pid INT, FOREIGN KEY (pid) REFERENCES Profiles(pid))"


connection.connect(function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("connected to mysql...");
    }
})


connection.query(createProfilesQuery, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("profiles table created");
    }
})

connection.query(createUsersQuery, function(error) {
    if (error) {
        // console.log(error);
    } else {
        console.log("users table created");
    }
})

module.exports = connection;

