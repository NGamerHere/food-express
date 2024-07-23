const express = require('express');
const pool = require("../db");

const state = express.Router();


state.get('/api/getCities',async (req, res) => {
    try{
        const [cities]= await pool.query('select cities.id,cities.cityName,states.stateName from cities inner join states on states.id=cities.stateid');
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
});

state.get('/api/autocomplete/getCities/',async (req, res) => {
    const apl=req.query.apl;
    try{
        const [cities]= await pool.query('select * from cities where cityName REGEXP ? order by cityName;',[apl]);
        res.json(cities);
    }catch (e) {
        console.error('error in fetching cities '+e);
        res.json(e);
    }
})




module.exports=state;