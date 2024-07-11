const express=require('express');
const pool=require('../db');

const categories=express.Router();


categories.get('/getCategories',async (req,res)=>{
    try{
        const [result]=await pool.query('SELECT * FROM categories');
        res.json(result);
    }catch (e) {
        res.status(500).send({message:'internalServerError'})
        console.error('error in fetching the all the categories '+e)
    }
})

categories.get('/getItems',async (req,res)=>{
    const categoriesID=req.query.categoriesID;
    try{
        const [result]=await pool.query('SELECT * FROM items WHERE categoriesID=?',[categoriesID]);
        res.json(result);
    }catch (e) {
        res.status(500).send({message:'internalServerError'})
        console.error('error in fetching the all the categories '+e)
    }
});

module.exports=categories;