const mysql = require('mysql');
const dotenv = require('dotenv');
const { param } = require('../routes');
dotenv.config();


const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'root',
    password: process.env.RDS_PASSWORD || process.env.db_password,
    port: process.env.RDS_PORT,
  })

// connection.query("DROP DATABASE swiftapi", function(error){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("dropped all db")
//     }
// })

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

db.users.validate = (validate) => {
    if (validate.email !== undefined) {
        //find if email exists in db
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from USERS WHERE email = '${validate.email}' and password = '${validate.password}' LIMIT 1`, (error, results)=>{
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(results);
            })
        })
    } else if (validate.username !== undefined) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from USERS WHERE username = '${validate.username}' and password = '${validate.password}' LIMIT 1`, (error, results)=>{
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(results);
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from USERS WHERE phone = '${validate.phone}' and password = '${validate.password}' LIMIT 1`, (error, results)=>{
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(results);
            })
        })
    }
}

db.users.create = (params) => {
    console.log(new Date);
    if (params.email !== undefined) {
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
                connection.query(`INSERT INTO USERS(email, pid, password) VALUES ('${params.email}', '${pid}', '${params.password}')`, (error, results) => {
                    if (error) {
                        return reject(error.sqlMessage);
                    }
                    console.log("promise 2");
                   resolve(results);
                })
            })
        })
    } else if (params.username!==undefined) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO PROFILES(name, birthdate) VALUES ('${params.name}', '${params.birthdate}')`, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            })
        }).then((result)=>{
            return new Promise((resolve, reject)=> {
                const pid = result.insertId;
                connection.query(`INSERT INTO USERS(username, pid, password) VALUES ('${params.username}', '${pid}', '${params.password}')`, (error, results) => {
                    if (error) {
                        return reject(error.sqlMessage);
                    }
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
                connection.query(`INSERT INTO USERS(phone, pid, password) VALUES ('${params.phone}', '${pid}', '${params.password}')`, (error, results) => {
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

