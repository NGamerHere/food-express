const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const options = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBDATABASE,
};

const connection = mysql.createConnection(options);

const sessionStore = new MySQLStore({
    expiration: 1000 * 60 * 60 * 24 * 7, // Session expiration time
    createDatabaseTable: true,
    connection: connection,
    checkExpirationInterval: 1000 * 60 * 5, // Check expiration interval
    clearExpired: true,
}, connection);

module.exports = sessionStore;
