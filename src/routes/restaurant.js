const express=require('express')
const pool=require('../db');
const bcrypt = require("bcrypt");

const restaurant=express.Router();

restaurant.get('/restaurant/login',(req,res)=>{
    res.render('restaurantLogin');
});

restaurant.post('/restaurant/register',async (req,res)=>{
    try {
        const { ownerName,restaurantName,cityID,stateID, password, fassiID ,phone,email } = req.body;
        const [existingUsers] = await pool.query('SELECT * FROM restaurant WHERE restaurantName = ?', [restaurantName]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'this restaurant is already registered with us' ,err:'restaurantName'});
        }
        const [emailCheck]=await pool.query('SELECT * FROM restaurant WHERE email = ?', [email]);
        if (emailCheck.length > 0) {
            return res.status(409).json({ message: 'email already exists',err:'email' });
        }
        const [phoneCheck]=await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (phoneCheck.length > 0) {
            return res.status(409).json({ message: 'phone already exists' , err:'phone'});
        }
        const [fassiCheck]=await pool.query('SELECT * FROM restaurant WHERE fssaiID = ?', [fassiID]);
        if (fassiCheck.length > 0) {
            return res.status(409).json({ message: 'this fassiID is already registred with us' , err:'fassiID'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO restaurant (restaurantName, ownerName, cityID, stateID, email, phoneNo, password, fssaiID) VALUES (?, ?, ?,?,?,?,?,?)',
            [restaurantName,ownerName,cityID,stateID,email,phone,hashedPassword,fassiID]
        );
        res.status(201).json({ message: 'done', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
})


restaurant.post('/restaurant/login',async (req,res)=>{
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM restaurant WHERE email = ?', [email]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                req.session.role='restaurant';
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

restaurant.get('/restaurant/registration',(req,res)=>{
    res.render('restaurantRegistration');
});


restaurant.get('/restaurant/dashboard',(req,res)=>{
   res.render('restaurantDashboard');
});

module.exports=restaurant;