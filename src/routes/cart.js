const express=require('express');
const pool=require('../db');
const getName=require('../components/getName');

const cart=express.Router();

cart.get('/cart',async (req,res)=>{
    if(req.session.userId){
        const [name]=await pool.query('SELECT name FROM users where id=?',[req.session.userId]);
        res.render('cart',{name:name[0]['name']})
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
        res.status(500).json({message:'internal server error',error:e})
        console.log('error in deleting the items cart from the '+e);
    }
});

cart.get('/getCartdetails',async (req,res)=>{
   try{
       const [result]=await pool.query('SELECT cart.*, items.itemName, items.itemPrice \n' +
           'FROM cart\n' +
           'INNER JOIN items ON cart.itemid = items.itemID where userid=?',[req.session.userId]);
       return res.json(result);
   } catch (e) {
       res.status(500).json({message:'internal server error',error:e})
       console.log('error in fetching the items cart from the '+e);
   }
});

module.exports=cart;