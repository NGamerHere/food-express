const express=require('express')
const pool=require('../db');

const restaurant=express.Router();

restaurant.get('/restaurant/login',(req,res)=>{
    res.render('restaurantLogin');
});

restaurant.post('/restaurant/register',(req,res)=>{

})


restaurant.post('/restaurant/login',(req,res)=>{

});

restaurant.get('/restaurant/registration',(req,res)=>{
    res.render('restaurantRegistration');
});


restaurant.get('/restaurant/dashboard',(req,res)=>{
   res.render('restaurantDashboard');
});

module.exports=restaurant;