import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import http from 'http'; // Import http for creating server
import { Server } from 'socket.io';
import cors from 'cors';
import signupRouter from './pages/api/signup.js'; 
import loginRouter from './pages/api/login.js';   
import jobPostRouter from './pages/api/jobPost.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Setup multer for parsing FormData
const upload = multer();
app.use(upload.any()); // Parse multipart/form-data
app.use(express.json()); // Parse JSON bodies

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'], // Adjust to your front-end URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/jobPost', jobPostRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Create an HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server running on http://localhost:${PORT}`);
    }
});
