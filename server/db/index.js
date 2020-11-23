const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();


const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'root',
    password: process.env.RDS_PASSWORD || process.env.db_password,
    port: process.env.RDS_PORT,
  })

connection.query("DROP DATABASE swiftapi", function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("dropped all db")
    }
})

var dbName = "swiftapi"

const createDatabase = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

const createProfilesQuery = "CREATE TABLE IF NOT EXISTS PROFILES (pid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL, birthdate DATE NOT NULL, gender VARCHAR(20))"

const createUsersQuery = "CREATE TABLE IF NOT EXISTS USERS (uid INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) UNIQUE, password VARCHAR(255), email VARCHAR(100) UNIQUE, phone VARCHAR(50) UNIQUE, pid INT, FOREIGN KEY (pid) REFERENCES PROFILES(pid) ON DELETE CASCADE)"

connection.query(createDatabase, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log(`database created and using ${dbName}`);
    }
})

connection.query(`USE ${dbName}`, function(error){
    if (error) {
        console.log(error);
    } else {
        console.log(`Using ${dbName}`)
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
        console.log("users table failed to create");
        console.log(error);
    } else {
        console.log("users table created");
    }
})


let db = {users: {all: null, getUserById: null}, profiles: {all: null}};

db.users.all = () => {
    return new Promise((resolve,reject)=>{
        connection.query("SELECT * from USERS", (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    })
}

db.users.getUserById = (id) => {
    return new Promise ((resolve, reject)=>{
        connection.query(`SELECT * from USERS WHERE uid = ${id}`, (error, results)=>{
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    })
}

db.users.create = (params) => {
    if (params.email != undefined) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO PROFILES(name, birthdate) VALUES ('${params.name}', '${params.birthdate}')`, (error, results) => {
                if (error) {
                    return reject(error);
                }
                console.log("promise 1");
                resolve(results);
            })
        }).then((result)=>{
            return new Promise((resolve, reject)=> {
                const pid = result.insertId;
                connection.query(`INSERT INTO USERS(email, pid) VALUES ('${params.email}', '${pid}')`, (error, results) => {
                    if (error) {
                        return reject(error.sqlMessage);
                    }
                    console.log("promise 2");
                   resolve(results);
                })
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO PROFILES(name, birthdate) VALUES ('${params.name}', '${params.birthdate}')`, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }).then(result=>{
            return new Promise((resolve,reject)=> {
                const pid = result.insertId;
                connection.query(`INSERT INTO USERS(phone, pid) VALUES ('${params.phone}', '${pid}')`, (error, results) => {
                    if (error) {
                        return reject(error.sqlMessage);
                    }
                    resolve(results);
                })
            })
        })
    }
}

db.profiles.all = () => {
    return new Promise((resolve,reject)=>{
        connection.query("SELECT * from PROFILES", (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    })
}


module.exports = db;

