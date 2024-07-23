const express=require("express");
const testing=express.Router();

testing.get('/testing',(req,res)=>{
    res.render('testing');
});


module.exports = testing;