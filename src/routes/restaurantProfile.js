
const express = require("express");
const db = require("../db");
const pool = require("../db");

const restaurantProfile=express.Router();

restaurantProfile.get('/location/:cityName',async (req,res)=>{
   const {cityName}=req.params;
    const [resDetails]=
        await pool.query(
        'select restaurant.id,restaurantName,c.id,cityName from restaurant inner join foodexpress.cities as c on restaurant.cityID = c.id where c.cityName=?;', [cityName]);
    if(resDetails.length > 0){
        res.send(resDetails);
    }else{
        //@todo need to add the city not found ejs rendering
        res.send(cityName);
    }

});

module.exports=restaurantProfile;