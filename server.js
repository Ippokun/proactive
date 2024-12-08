require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRouter = require('./pages/api/signup');
const loginRouter = require('./pages/api/login');
const jobPostRouter = require('./pages/api/jobPost');

const app = express();
const PORT = process.env.PORT || 4000; 

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

// Routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/jobPost', jobPostRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});