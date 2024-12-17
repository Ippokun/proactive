import express from 'express';
import pool from '../../db/pool.js';

const router = express.Router();

// POST for application from freelancer
router.post('/', async (req, res) => {
  const { freelancer_id, jobpost_id, job_title, proposal, bid } = req.body;

  if (!freelancer_id || !jobpost_id || !job_title || !proposal || !bid) {
      return res.status(400).json({ message: "Missing required fields." });
  }

  try {
      // Insert the application into the database
      const result = await pool.query(
          `INSERT INTO applications (freelancer_id, jobpost_id, job_title, proposal, bid, status)
           VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
          [freelancer_id, jobpost_id, job_title, proposal, bid]
      );

      const application = result.rows[0];
      res.status(201).json(application); // Return the created application object
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while submitting the application." });
  }
});

// Get all proposals for a specific client
router.get('/client/:client_id', async (req, res) => {
    const { client_id } = req.params; // Extract client_id from the URL
    console.log("client_id", client_id);

    try {
        // SQL query to fetch proposals for the client's job posts
        const result = await pool.query(
            `SELECT 
                a.id AS application_id,
                jp.title AS job_title,
                u.first_name || ' ' || u.last_name AS freelancer_name,
                a.proposal,
                a.bid,
                a.status,
                a.jobpost_id,
                a.freelancer_id  -- Added freelancer_id to the query
             FROM 
                applications a
             JOIN 
                users u ON a.freelancer_id = u.id
             JOIN 
                jobposts jp ON jp.id = a.jobpost_id
             WHERE 
                jp.client_id = $1`,
            [client_id]
        );        

        res.status(200).json(result.rows); // Send the proposals to the frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching proposals." });
    }
});

// store the accpeted application from client
router.patch('/accept/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Update the application's status to "accepted"
      await pool.query(
        'UPDATE applications SET status = $1 WHERE id = $2',
        ['accepted', id]
      );
      res.status(200).json({ success: true, message: 'Application accepted' });
    } catch (error) {
      console.error('Error accepting application:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

// store the rejected application from client
router.patch('/rejected/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the application's status to "rejected"
    await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2',
      ['rejected', id]
    );
    res.status(200).json({ success: true, message: 'Application rejected' });
  } catch (error) {
    console.error('Error declining application:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
