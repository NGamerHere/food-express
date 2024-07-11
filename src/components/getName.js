const pool = require('../db');

async function getName(userid) {
    try {
        const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [userid]);
        if (rows.length > 0) {
            return rows[0].name; // Return just the name
        } else {
            return null; // Or however you want to handle no results
        }
    } catch (error) {
        console.error('Error fetching name:', error);
        throw error; // Re-throw the error or handle it as appropriate
    }
}

module.exports = getName;