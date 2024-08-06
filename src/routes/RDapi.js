const express=require('express');
const pool=require('../db');

const RDapi=express.Router();

RDapi.get('/api/dashboard/items',async (req,res)=>{
    const userid=req.session.userId;
    try{
        const [result]=await pool.query('select items.id, itemName, price,categoryName,foodType.type from items inner join foodType  on items.foodTypeID = foodType.id inner join foodexpress.categories  on items.categoryID = categories.id where items.restaurantID=?',[userid]);
        res.json(result);
    }catch (e) {
        console.log(e);
        res.status(500).json({'message':'internal server error',error:e});
    }
});

RDapi.get('/api/dashboard/itemsCount',async (req,res)=>{
    const userid=req.session.userId;
    try{
        const [result]=await pool.query('select categoryName,count(*) as count_name from items inner join categories on items.categoryID = categories.id where items.restaurantID=? group by categoryName;',[userid]);
        res.json(result);
    }catch (e) {
        console.log(e);
        res.status(500).json({'message':'internal server error',error:e});
    }
});

module.exports=RDapi;