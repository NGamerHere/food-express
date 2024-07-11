const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session=require('express-session');
const login = require("./routes/login");
const registration=require('./routes/registration');
const cart=require('./routes/cart');
const dashboard=require('./routes/dashboard');
const categories=require('./routes/categories');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.set('view engine','ejs');
app.use(express.static('public'))



app.use(session({
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 }
}));

app.use(login);
app.use(registration);
app.use(dashboard);
app.use(cart);
app.use(categories);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
