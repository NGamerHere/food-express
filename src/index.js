const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session=require('express-session');
const login = require("./login");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.set('view engine','ejs');
app.use(express.static('public'))

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBDATABASE,
    connectionLimit: 10
});

app.use(session({
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 }
}));

app.use(login);


app.get('/',(req, res)=>{
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('home',{name:'datta'});
})



app.get('/registration',(req, res)=>{
    if(req.session.userId){
       return res.redirect('/dashboard');
    }
    res.render('registration');
})

app.get('/cart',(req,res)=>{
    if(req.session.userId){
        res.render('cart')
    }else{
        res.redirect('/login');
    }
});

app.get('/dashboard', async (req, res) => {
    if (req.session.userId) {
        const [name] = await pool.query('SELECT name FROM users WHERE id = ?', [req.session.userId]);
        res.render('dashboard', { name: name[0]['name'] });
    } else {
        res.redirect('/login');
    }
});

app.post('/addItemToCart',async (req,res)=>{
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

app.post('/editQuantity',async (req,res)=>{
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

app.post('/deleteItemsFromCart',async (req,res)=>{
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


app.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.post('/registration', async (req, res) => {
    try {
        const { username, password, name ,phone,email } = req.body;
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, name, password,phone,email) VALUES (?, ?, ?,?,?)',
            [username, name, hashedPassword,phone,email]
        );
        res.status(201).json({ message: 'done', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
});

app.get('/getCategories',async (req,res)=>{
    try{
        const [result]=await pool.query('SELECT * FROM categories');
        res.json(result);
    }catch (e) {
        res.status(500).send({message:'internalServerError'})
        console.error('error in fetching the all the categories '+e)
    }
})

app.get('/getItems',async (req,res)=>{
    const categoriesID=req.query.categoriesID;
    try{
        const [result]=await pool.query('SELECT * FROM items WHERE categoriesID=?',[categoriesID]);
        res.json(result);
    }catch (e) {
        res.status(500).send({message:'internalServerError'})
        console.error('error in fetching the all the categories '+e)
    }
});

app.get('/getusers', async (req, res) => {
    const id = req.query.id;
    try {
        const [result] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json({ users: result });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
