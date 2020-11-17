const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.db_password,
    database: 'sys'
  })
  
connection.connect(function(error) {
    if (error) {
    console.log(error);
    } else {
        console.log("connected to mysql...");
    }
})


module.exports = connection;

