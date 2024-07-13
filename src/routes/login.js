const express=require('express');
const bcrypt = require("bcrypt");
const pool=require('../db');
const {loginMiddlewareHandle,loginAPIHandle}=require('../middleware/loginMiddlewareHandle');


const login=express.Router();

login.get('/login',loginMiddlewareHandle,(req, res)=>{
    res.render('login');
})


login.post('/login',loginAPIHandle, async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                const [logger]=await pool.query('INSERT INTO loginDetails (userid,status,loginIP) VALUES (?,?,?) ',[req.session.userId,'active',req.ip.slice(7)]);
                req.session.loggerID=logger.insertId;
                res.json({ message: 'done' });
            } else {
                res.json({ message: 'Wrong password' ,err:'password'});
            }
        } else {
            res.json({ message: 'Username not found' ,err:'username'});
        }
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'An error occurred during signin' });
    }
});

module.exports=login;