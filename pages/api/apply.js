import express from 'express';
import pool from '../../db/pool.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { freelancer_id, jobpost_id, job_title, proposal, bid } = req.body;

  if (!freelancer_id || !jobpost_id || !job_title || !proposal || !bid) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if an application already exists
    const checkExisting = await pool.query(
      `SELECT * FROM applications WHERE freelancer_id = $1 AND jobpost_id = $2`,
      [freelancer_id, jobpost_id]
    );

    if (checkExisting.rows.length > 0) {
      return res.status(409).json({ message: "Та энэ ажилд аль хэдийн хүсэлт гаргасан." });
    }

    // Insert the application into the database
    const result = await pool.query(
      `INSERT INTO applications (freelancer_id, jobpost_id, job_title, proposal, bid, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [freelancer_id, jobpost_id, job_title, proposal, bid]
    );

    const application = result.rows[0];

    // Send back the application with status
    res.status(201).json({
      message: 'Application submitted successfully!',
      application: application // The application with status 'pending'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while submitting the application." });
  }
});

// GET status of application for freelancer
router.get('/status', async (req, res) => {
  const { userId } = req.query; // Extract userId from the query string

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // Query the database to fetch applications for this userId
    const result = await pool.query(
      `SELECT * FROM applications WHERE freelancer_id = $1`,
      [userId] // Use the userId from the query parameter
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No applications found for this freelancer.' });
    }

    return res.status(200).json(result.rows); // Return the applications
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ message: 'Error fetching applications' });
  }
});

// PATCH request to withdraw an application (FREELANCER)
router.patch('/withdraw/:id', async (req, res) => {
  const applicationId = req.params.id;
  const query = `UPDATE applications SET status = $2 WHERE id = $1 RETURNING *`;

  try {
    // Using two parameters for better SQL safety
    const result = await pool.query(query, [applicationId, 'withdrawn']);

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        message: 'Application not found or you do not have permission to withdraw it' 
      });
    }

    res.status(200).json({ 
      message: 'Application withdrawn successfully', 
      data: result.rows[0] 
    });

  } catch (error) {
    console.error('Error withdrawing application:', {
      code: error.code,
      message: error.message,
      detail: error.detail
    });

    // Handle specific PostgreSQL errors
    if (error.code === '22P02') { // invalid_text_representation for enum
      return res.status(400).json({ 
        message: 'Invalid status value for application' 
      });
    }

    if (error.code === '23514') { // check_violation
      return res.status(400).json({ 
        message: 'Cannot update application status' 
      });
    }

    res.status(500).json({ 
      message: 'An error occurred while withdrawing the application' 
    });
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
