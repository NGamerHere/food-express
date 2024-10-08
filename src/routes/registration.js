const express=require('express');
const pool=require('../db')
const bcrypt = require("bcrypt");

const registration=express.Router();

registration.get('/registration',(req, res)=>{
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('registration');
})

registration.post('/registration', async (req, res) => {
    try {
        const { username, password, name ,phone,email } = req.body;
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username already exists' ,err:'username'});
        }
        const [emailCheck]=await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (emailCheck.length > 0) {
            return res.status(409).json({ message: 'email already exists',err:'email' });
        }
        const [phoneCheck]=await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (phoneCheck.length > 0) {
            return res.status(409).json({ message: 'phone already exists' , err:'phone'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, name, password,phone,email) VALUES (?, ?, ?,?,?)',
            [username, name, hashedPassword,phone,email]
        );
        res.status(201).json({ message: 'done', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
});

module.exports=registration;