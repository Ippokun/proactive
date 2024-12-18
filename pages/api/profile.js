import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../../db/pool.js';

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// POST request for uploading profile picture
router.post('/profile-picture', upload.single('profile_picture'), async (req, res) => {
  const { userId } = req.body; // Assuming the userId is provided in the request body

  // Validate if the file and userId are provided
  if (!userId || !req.file) {
    return res.status(400).json({ message: 'User ID and profile picture are required.' });
  }

  const profilePicturePath = `/uploads/${req.file.filename}`; // Path to the uploaded file

  try {
    // Update the user's profile picture in the database
    const result = await pool.query(
      `UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING *`,
      [profilePicturePath, userId]
    );

    if (result.rows.length > 0) {
      const updatedUser = result.rows[0];
      res.status(200).json({ message: 'Profile picture uploaded successfully!', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error while uploading profile picture:', error);
    res.status(500).json({ message: 'An error occurred while uploading the profile picture.' });
  }
});

export default router;
