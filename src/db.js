const mysql = require("mysql2/promise");
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBDATABASE,
    connectionLimit: 10
});

module.exports=pool;