const express=require('express');
const bcrypt = require("bcrypt");
const pool=require('../db');

const login=express.Router();

login.get('/login',(req, res)=>{
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('login');
})


login.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                res.json({ message: 'done' });
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

module.exports=login;