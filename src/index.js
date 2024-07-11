const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session=require('express-session');
const login = require("./routes/login");
const registration=require('./routes/registration')
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
app.use(registration);


app.get('/',(req, res)=>{
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('home',{name:'datta'});
})







app.get('/dashboard', async (req, res) => {
    if (req.session.userId) {
        const [name] = await pool.query('SELECT name FROM users WHERE id = ?', [req.session.userId]);
        res.render('dashboard', { name: name[0]['name'] });
    } else {
        res.redirect('/login');
    }
});



app.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('/');
})



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
