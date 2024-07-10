const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session=require('express-session');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.set('view engine','ejs');

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBDATABASE,
    connectionLimit: 10
});

app.use(session({
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // session timeout of 60 seconds
}));


app.get('/',(req, res)=>{
    res.render('home',{name:'datta'});
})

app.get('/login',(req, res)=>{
    res.render('login');
})

app.get('/registration',(req, res)=>{
    res.render('registration');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.id=user['_id'];
                res.json({ message: 'You have access' });
            } else {
                res.json({ message: 'Wrong password' });
            }
        } else {
            res.json({ message: 'Username not found' });
        }
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'An error occurred during signin' });
    }
});

app.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.post('/registration', async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, name, password) VALUES (?, ?, ?)',
            [username, name, hashedPassword]
        );
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
});

app.get('/getusers', async (req, res) => {
    const id = req.query.id;
    try {
        const [result] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json({ users: result });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
