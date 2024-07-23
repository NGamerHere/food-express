const express = require('express');
const pool = require("../db");

const state = express.Router();

state.get('/api/getStates/',async (req, res)=>{
   try{
       const [states]=await pool.query('select * from states');
       res.send(states);
   }catch (e) {
       console.log(e);
       res.status(501).json(e);
   }
});




module.exports=state;