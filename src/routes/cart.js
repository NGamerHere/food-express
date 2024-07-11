const express=require('express');
const pool=require('../db')

const cart=express.Router();

cart.get('/cart',(req,res)=>{
    if(req.session.userId){
        res.render('cart')
    }else{
        res.redirect('/login');
    }
});


cart.post('/addItemToCart',async (req,res)=>{
    const userid=req.session.userId;
    const itemID=req.body.itemID;
    try{
        const [searchQuery]=await pool.query('SELECT * FROM cart WHERE userid=? AND itemID=?',[userid,itemID]);
        if(searchQuery.length > 0){
            const [updateQuery]=await pool.query('UPDATE cart SET quantity=quantity+1 WHERE cartID=?',[searchQuery[0]['cartID']]);
            if(updateQuery.changedRows > 0){
                res.json({message:'done'});
            }else{
                res.status(500).json({message:'internal server error'})
            }
        }else{
            const [result]=await pool.query('INSERT INTO cart (userid, itemid, quantity) VALUES (?,?,?)',[userid,itemID,1]);
            if(result.insertId > 0){
                res.json({'message':'done'});
            }else{
                result.status(500).json({'message':'internal Server Error'})
            }
        }
    }catch (e){
        res.status(500).json("internal server error");
        console.error('error in adding items into the cart '+e);
    }
})

cart.post('/editQuantity',async (req,res)=>{
    const userid=req.session.userId;
    const itemID=req.body.itemID;
    const action=req.body.action;
    try{
        if(action === 'add'){
            const [query]=await pool.query('UPDATE cart SET quantity=quantity+1 WHERE userid=? AND itemid=?;',[userid,itemID]);
            if(query.changedRows > 0){
                res.json({'message':'done'});
            }else{
                res.status(500).json({'message':'cant be able to edit the quantity'})
            }
        }else if(action === 'delete'){
            const [query]=await pool.query('UPDATE cart SET quantity=quantity-1 WHERE userid=? AND itemid=?;',[userid,itemID]);
            if(query.changedRows > 0){
                res.json({'message':'done'});
            }else{
                res.status(500).json({'message':'cant be able to edit the quantity'})
            }
        }
    } catch (e) {
        if(e.error.code === 'ER_CHECK_CONSTRAINT_VIOLATED'){
            return  res.status(500).json({message:'you can add the only 10 items in the cart'})
        }
        console.error('error in editing the quantity : '+e);
        res.status(500).json({message:'internal server error',error:e})
    }
});

cart.post('/deleteItemsFromCart',async (req,res)=>{
    const cartID=req.body.cartID;
    try{
        const [deleteQuery]=await pool.query('DELETE FROM cart WHERE cartID=?',[cartID])
        if(deleteQuery.affectedRows){
            res.json({'message':'done'});
        }else{
            res.send({'message':'item not found in the cart'});
        }
    }catch (e) {
        console.log('error in deleting the items cart from the '+e);
    }
});