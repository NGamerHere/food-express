const express=require('express');
const pool=require('../db');

const profile=express.Router();

function profileSessionHandler(req,res,next){
    if(req.session.userId){
        return res.redirect('/login');
    }else{
        next();
    }
}

profile.get('/profile',profileSessionHandler,async (req,res)=>{
    res.render('profile');
});

profile.post('/appAddress',async (req, res)=>{
    const { houseNO, streetName, areaName, landmark, city, district, state, pincode,country}=req.body;

    const [result]=await pool.query('INSERT INTO address (userid, houseNO, streetName, areaName, landmark, city, district, state, country,pincode) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ,[req.session.userId , houseNO, streetName, areaName, landmark, city, district, state, country ,pincode]
    );
    if(result.insertId > 0 ){
        return res.json({'message':'done'})
    }else{
        return res.json({'message':'internal server error'})
    }

});

profile.get('/getAddress',async (req,res)=>{
   const [result]=await pool.query("SELECT * FROM address WHERE userid=?",[req.session.userId]);
   res.json({result});
});

profile.post('/editAddress', async (req, res) => {
    const { houseNO, streetName, areaName, landmark, city, district, state, pincode, country, id } = req.body;

    try {
        const [updateResult] = await pool.query(
            'UPDATE address SET houseNO = ?, streetName = ?, areaName = ?, landmark = ?, city = ?, district = ?, state = ?, country = ?, pincode = ? WHERE id = ?',
            [houseNO, streetName, areaName, landmark, city, district, state, country, pincode, id]
        );

        return res.send({ updateResult });
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).send({ error: 'An error occurred while updating the address' });
    }
});
module.exports=profile;
