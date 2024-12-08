const express = require('express');
const router = express.Router();
const pool = require('../../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // JWT for authentication

// Route: Post /api/login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    try {
        // check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0 ) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        console.log('DB query result:', result.rows[0]); // checking user data
        console.log('Role beign sent in response:', user.role); // Logs from DB

        //Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('User role being sent:', user.role); // checking usr role.
        // Send the token as the response
        res.status(200).json({
            message: 'Login succesful',
            token,
            role: user.role // Assuming `role` 
         });
    }  catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} );

module.exports = router;