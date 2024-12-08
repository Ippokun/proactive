const express = require('express');
const router = express.Router();
const pool = require('../../db/pool');
const bcrypt = require('bcrypt'); // password hashing

// Route: POST /api/signup
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    // Input validation basic
    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({error: 'All fields are required!'});
    }

    try {
        // Check if email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email is already registered!'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, role, created_at) 
             VALUES ($1, $2, $3, $4, $5, NOW()) 
             RETURNING id`,
            [firstName, lastName, email, hashedPassword, role]
        );

        // Respond with success 
        res.status(201).json({ message: 'User created succesfully!', userId: result.rows[0].id });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({error: 'Internal Server Error' });
    }
});

module.exports = router;