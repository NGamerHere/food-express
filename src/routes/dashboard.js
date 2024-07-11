const express=require('express');
const pool=require('../db');

const dashboard=express.Router();

dashboard.get('/',(req, res)=>{
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('home',{name:'datta'});
})
dashboard.get('/dashboard', async (req, res) => {
    if (req.session.userId) {
        const [name] = await pool.query('SELECT name FROM users WHERE id = ?', [req.session.userId]);
        res.render('dashboard', { name: name[0]['name'] });
    } else {
        res.redirect('/login');
    }
});



dashboard.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('/');
})

module.exports=dashboard;