import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../../db/pool.js';
import cors from 'cors';

const router = express.Router();

// Enable CORS
router.use(cors());

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profiles/'); // Changed to public folder for easier access
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only jpeg, jpg and png files are allowed!'));
    }
});

// Route: POST /api/profile-picture
router.post('/profile-picture', upload.single('profile_picture'), async (req, res) => {
    try {
        const userId = req.body.userId;
        
        // Validate user ID
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required!' });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create the profile picture URL path
        const profilePicturePath = `/uploads/profiles/${req.file.filename}`;

        // First check if user exists
        const userCheck = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update or insert profile picture in user_profiles
        const result = await pool.query(
            `INSERT INTO user_profiles (user_id, profile_picture, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET 
                profile_picture = $2,
                updated_at = NOW()
             RETURNING id, user_id, profile_picture, bio, created_at, updated_at`,
            [userId, profilePicturePath]
        );

        // Send back the complete profile data
        res.status(200).json({
            message: 'Profile picture updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error uploading profile picture:', error);
        
        // Send appropriate error message
        if (error.code === '23503') { // Foreign key violation
            res.status(400).json({ error: 'Invalid user ID' });
        } else if (error.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Profile already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Route: GET /api/profile-picture/:userId
router.get('/profile-picture/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Get complete profile data
        const result = await pool.query(
            `SELECT up.id, up.user_id, up.profile_picture, up.bio, 
                    up.created_at, up.updated_at
             FROM user_profiles up
             WHERE up.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Profile not found',
                user: { profile_picture: null } // Return null profile picture for frontend
            });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: GET /api/profile/:userId - Get complete profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT up.*, u.first_name, u.last_name, u.email, u.role
             FROM user_profiles up
             JOIN users u ON u.id = up.user_id
             WHERE up.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: PUT /api/user-bio
router.put('/user-bio', async (req, res) => {
    try {
        const { userId, bio } = req.body;

        if (!userId || !bio) {
            return res.status(400).json({ error: 'User ID and bio are required!' });
        }

        const result = await pool.query(
            `INSERT INTO user_profiles (user_id, bio, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET 
               bio = $2,
               updated_at = NOW()
             RETURNING *`,
            [userId, bio]
        );

        res.status(200).json({
            message: 'Bio updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;