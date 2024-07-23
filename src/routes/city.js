const express = require('express');
const pool = require("../db");

const city = express.Router();


city.get('/api/getCities',async (req, res) => {
    try{
        const [cities]= await pool.query('SELECT * FROM cities');
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
});

city.get('/api/getCitiesBystate',async (req, res) => {
    const stateID=req.query.stateID;
    try{
        const [cities]= await pool.query('SELECT * FROM cities where stateid=? order by cityName',[stateID]);
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
});
city.get('/api/getCities',async (req, res) => {
    try{
        const [cities]= await pool.query('select cities.id,cities.cityName,states.stateName from cities inner join states on states.id=cities.stateid');
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
});

city.get('/api/autocomplete/getCities/',async (req, res) => {
    const apl=req.query.apl;
    try{
        const [cities]= await pool.query('select * from cities where cityName REGEXP ? order by cityName;',[apl]);
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
})

module.exports=city;