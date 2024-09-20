
const express = require("express");
const db = require("../db");
const pool = require("../db");

const restaurantProfile=express.Router();

restaurantProfile.get('/location/:cityName',async (req,res)=>{
   const {cityName}=req.params;
    //const [resDetails]=
        //await pool.query(
        //'select restaurant.id,restaurantName as name,c.id,cityName from restaurant inner join foodexpress.cities as c on restaurant.cityID = c.id where c.cityName=?;', [cityName]);

    const [resDetails]=await pool.query('select * from restaurant');

    if(resDetails.length > 0){
        const totalDetails=resDetails.map((item)=>{
            item.description='this is the one of the wonderful city'
            return item
        })
        res.render('restaurantsCity',{ restaurants: totalDetails , name: cityName })
    }else{
        //@todo need to add the city not found ejs rendering
        res.render('ResNotFound');
    }

});

module.exports=restaurantProfile;