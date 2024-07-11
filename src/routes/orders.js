const express=require('express')
const pool=require('../db');

const orders=express.Router();

orders.post('/checkout',async (req, res)=>{
    const userID=req.session.userId;
    try{
        const [orderCreation]=await pool.query('INSERT INTO orders (userid,totalAmount) VALUES (?,?)',[userID,req.body.totalAmount])
        const orderID=orderCreation.insertId;
        //console.log(orderID);
        const [result]=await pool.query('select cart.*,i.itemPrice  from cart inner join foodexpress.items i on cart.itemid = i.itemID where userid=?;',[req.session.userId]);
        //res.json([orderCreation,result]);
        for (const item of result) {
            const [insertQuery]=await pool.query('INSERT INTO orderItems(orderID, userID, itemID, quantity, itemPrice) VALUE (?,?,?,?,?) ',
                [orderID,userID, item.itemid, item.quantity,item.itemPrice ]  );
            console.log(insertQuery.insertId + " was inserted into the ordersItems");
        }
        pool.query('DELETE FROM cart WHERE userid=?',[userID]);
        res.json({message:'done'});
    }catch (e) {
        console.log(e);
        res.json({error:e});
    }
});


module.exports=orders;