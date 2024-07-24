const express=require('express');
const pool=require('../db');

const categories=express.Router();

categories.post('/api/categories',async (req,res)=>{
    const userid=req.session.userId;
    const categoryName=req.body.categoryName;
    try{
        const [result]=await pool.query('insert into categories(categoryName, restaurantID) value (?,?)',[categoryName,userid]);
        if(result['affectedRows'] > 0 ){
            res.json({'message':'done'});
        }else{
            res.status(500).json({'message':'error'});
        }
    }catch (e) {
        console.log(e);
        res.status(500).json({'message':'internal server error',error:e});
    }
});
categories.get('/api/categories',async (req,res)=>{
    const userid=req.session.userId;
    try{
        const [result]=await pool.query('select * from categories where restaurantID=?',[userid]);
        res.json(result);
    }catch (e) {
        console.log(e);
        res.status(500).json({'message':'internal server error',error:e});
    }
})
categories.patch('/api/categories',async (req,res)=>{
    const userid=req.session.userId;
    const id=req.body.id;
    const categoryName=req.body.categoryName;
    try{
        const [result]=await pool.query('update categories set categoryName=? where id=? and restaurantID=?;',[categoryName,id,userid]);
        if(result['affectedRows'] > 0 ){
            res.json({'message':'done'});
        }else{
            res.status(500).json({'message':'error'});
        }
    }catch (e) {
        console.log(e);
        res.status(500).json({'message':'internal server error',error:e});
    }
});
categories.delete('/api/categories',async (req,res)=>{
   const id=req.body.id;
   try{
       const [result]=await pool.query('delete from categories where id=?',[id]);
       if(result['affectedRows'] > 0 ){
           res.json({'message':'done'});
       }else {
           res.status(500).json({'message':'error'});
       }
   }catch (e) {
       console.log(e);
       res.status(500).json({'message':'internal server error',error:e});
   }
});
module.exports=categories;