const express = require('express');
const pool = require("../db");

const items = express.Router();

items.get('/api/items',async (req, res) => {
    try {
        const restaurantID = req.session.userId;
        const [result] = await pool.query('select * from items where restaurantID=?',[restaurantID] );
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while adding the item' });
    }
});

items.post('/api/items', async (req, res) => {
    try {
        const { itemName, categoryID, price,foodTypeID } = req.body;
        const restaurantID = req.session.userId;
        const [result] = await pool.query('INSERT INTO items (itemName, price, categoryID, restaurantID,foodTypeID) VALUES (?, ?, ?, ?,?)', [itemName, price, categoryID, restaurantID,foodTypeID]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Item added successfully' });
        } else {
            res.status(500).json({ message: 'Failed to add item' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while adding the item' });
    }
});

items.delete('/api/items/:id', async (req, res) => {
    try {
        const id=req.params.id;
        const restaurantID = req.session.userId;
        const [result] = await pool.query('delete  from items where id=? and restaurantID=?',[id,restaurantID]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Item deleted successfully successfully' });
        } else {
            res.status(500).json({ message: 'Failed to delete item' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while adding the item' });
    }
});


items.patch('/api/items', async (req, res) => {
    try {
        const { itemName, categoryID, price,foodTypeID,id } = req.body;
        const restaurantID = req.session.userId;
        const [result] = await pool.query('update items set itemName=?,price=?,categoryID=?,foodTypeID=? where id=? and restaurantID=?', [itemName, price, categoryID,foodTypeID,id,restaurantID,]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Item Updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to add item' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while adding the item' });
    }
});

module.exports = items;
