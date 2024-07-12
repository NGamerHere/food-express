const express=require('express')
const pool=require('../db');
function login(req, res,next){
    if(req.session.userId){
        next();
    }else{
        return res.status(401).send('Not logged in');
    }
}

const orders=express.Router();

orders.get('/orders',login,(req,res)=>{
   res.render('orders');
});


orders.post('/checkout',login,async (req, res)=>{
    const userID=req.session.userId;
    try{
        const [result]=await pool.query('select cart.*,i.itemPrice  from cart inner join foodexpress.items i on cart.itemid = i.itemID where userid=?;',[req.session.userId]);
        if(result.length === 0){
            return res.json({message:'zero items in the cart'});
        }
        const [orderCreation]=await pool.query('INSERT INTO orders (userid,totalAmount) VALUES (?,?)',[userID,req.body.totalAmount])
        const orderID=orderCreation.insertId;
        //console.log(orderID);

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
orders.get('/getOrders',login,async (req,res)=>{
    try{
        const [result]=await pool.query('SELECT * FROM orders WHERE userid=?;',[req.session.userId]);
        res.json(result);
    } catch (e) {
        console.log("error in getting the orders: "+e);
        res.json({error:e});
    }
})

orders.get('/getOrderItems',login,async (req,res)=>{
   try{
       const [result]=await pool.query('SELECT i.itemName,i.itemPrice,quantity FROM orderitems INNER JOIN foodexpress.items i on orderitems.itemID=i.itemID WHERE userID=? AND orderID=?;',[req.session.userId,req.query.OrderID]);
       res.json(result);
   } catch (e) {
       console.log("error in getting the order items : "+e);
       res.json({error:e});
   }
});

module.exports=orders;