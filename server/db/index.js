const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: 'a123b123',
    database: 'my_db'
  })
  
connection.connect(function(error) {
    if (error) {
    console.log(error);
    } else {
        console.log("connected");
    }
})


module.exports = connection;

