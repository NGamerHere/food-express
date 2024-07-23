const express=require('express');
const pool=require('../db');
const {dashboardSessionHandle,homeSessionHandle}=require('../middleware/dashboardSessionHandle');

const dashboard=express.Router();

dashboard.get('/',homeSessionHandle,(req, res)=>{
    res.render('home',{name:'datta'});
})
dashboard.get('/dashboard',dashboardSessionHandle, async (req, res) => {
        const [name] = await pool.query('SELECT name FROM users WHERE id = ?', [req.session.userId]);
        res.render('dashboard', { name: name[0]['name'] });
});



dashboard.get('/logout',async (req, res)=>{

    req.session.destroy();
    res.redirect('/');
})

module.exports=dashboard;