import express from 'express';
import pool from '../../db/pool.js';

const router = express.Router();

// Route: GET /api/hiredFreelancers
router.get('/Freelancers', async (req, res) => {
    const clientId = req.query.clientId; // Assume client ID is passed as a query parameter
    console.log("clientId", clientId);
    
    try {
      // Query to get the hired freelancers' details, including job title and payment status
      const result = await pool.query(
        `SELECT 
           freelancers.id AS freelancer_id,
           freelancers.first_name || ' ' || freelancers.last_name AS freelancer_name,
           jobposts.title AS job_title,
           payments.status AS payment_status
         FROM 
           applications
         JOIN 
           jobposts ON applications.jobpost_id = jobposts.id
         JOIN 
           users AS freelancers ON applications.freelancer_id = freelancers.id
         JOIN 
           payments ON applications.id = payments.application_id
         WHERE 
           jobposts.client_id = $1 AND applications.status = 'accepted'`, // Use jobposts.client_id instead of applications.client_id
        [clientId]
      );
  
      res.json(result.rows); // Send the result as JSON response
    } catch (error) {
      console.error("Error fetching hired freelancers:", error);
      res.status(500).json({ message: "Error fetching hired freelancers." });
    }
  });  

export default router;  
