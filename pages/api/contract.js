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


// GET payment status for freelancer
// router.get('/status/:applicationId', authenticateUser, async (req, res) => {
//   const { applicationId } = req.params;
//   const freelancerId = req.user.id; // Assuming auth middleware adds user to request

//   try {
//     // Get payment details including job title and client name
//     const result = await pool.query(
//       `SELECT 
//         p.id,
//         p.amount,
//         p.fee,
//         p.net_amount,
//         p.status,
//         p.created_at,
//         p.updated_at,
//         p.completed_at,
//         j.title as job_title,
//         CONCAT(u.first_name, ' ', u.last_name) as client_name
//       FROM payments p
//       JOIN applications a ON p.application_id = a.id
//       JOIN jobposts j ON a.jobpost_id = j.id
//       JOIN users u ON p.client_id = u.id
//       WHERE p.application_id = $1 AND p.freelancer_id = $2`,
//       [applicationId, freelancerId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching payment status:', error);
//     res.status(500).json({ message: 'An error occurred while fetching payment status.' });
//   }
// });


// // Freelancer submits their work
// router.post('/submit-work/:applicationId', async (req, res) => {
//   const { applicationId } = req.params;
//   const { workUrl, comments } = req.body;

//   try {
//       // Insert the submission into the database
//       const submissionResult = await pool.query(
//           `INSERT INTO submissions (application_id, work_url, comments, status) 
//           VALUES ($1, $2, $3, 'submitted') RETURNING *`,
//           [applicationId, workUrl, comments]
//       );

//       res.status(200).json({
//           message: 'Work submitted successfully!',
//           submission: submissionResult.rows[0],
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error submitting work.' });
//   }
// });


export default router;  
