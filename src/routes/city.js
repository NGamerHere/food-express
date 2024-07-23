const express = require('express');
const pool = require("../db");

const city = express.Router();


city.get('/getCities',async (req, res) => {
    try{
        const [cities]= await pool.query('SELECT * FROM cities');
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
});

module.exports=city;