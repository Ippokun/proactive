import express from 'express';
import pool from '../../db/pool.js';

const router = express.Router();

// POST for moving payment to escrow
router.post('/escrow', async (req, res) => {
  const { client_id, freelancer_id, application_id, amount } = req.body;
  console.log('1', req.body);

  // Validate input
  if (!client_id || !freelancer_id || !application_id || !amount) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  console.log('2', req.body);

  try {
    // 1. Insert payment into the database with 'in_escrow' status
    const result = await pool.query(
      `INSERT INTO payments (client_id, freelancer_id, application_id, amount, status)
      VALUES ($1, $2, $3, $4, 'in_escrow') RETURNING *`,
      [client_id, freelancer_id, application_id, amount]
    );

    const payment = result.rows[0]; // Now result is defined and can be used

    // 2. Update the application status to 'accepted' since the payment is in escrow
    await pool.query(
      `UPDATE applications SET status = 'accepted' WHERE id = $1 AND freelancer_id = $2 AND status = 'pending'`,
      [application_id, freelancer_id]
    );

    // 3. Respond with the payment details and status
    res.status(201).json({ payment, message: "Payment moved to escrow successfully." });
  } catch (error) {
    console.error("Error while moving payment to escrow:", error);
    res.status(500).json({ message: "An error occurred while moving the payment to escrow." });
  }
});

// GET For freelancer monitor the payment status of job
router.get('/status', async (req, res) => {
  const { freelancerId } = req.query; // Get freelancerId from query params

  try {
    // Fetch payment status for the freelancer
    const paymentResult = await pool.query(
      `SELECT p.status AS payment_status, p.amount, p.completed_at, a.job_title
       FROM payments p
       JOIN applications a ON p.application_id = a.id
       WHERE p.freelancer_id = $1`,
      [freelancerId]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: 'No payment information found for this freelancer.' });
    }

    // Return all payment statuses
    res.status(200).json(paymentResult.rows); // Send the entire rows array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving payment status.' });
  }
});


// GET submissions and application status for client.
router.get('/client', async (req, res) => {
  const { clientId } = req.query;

  // Convert clientId to integer and validate
  const clientIdInt = parseInt(clientId, 10);
  if (isNaN(clientIdInt)) {
    return res.status(400).json({ message: 'Invalid client ID' });
  }

  console.log("Fetching submissions for client with ID:", clientIdInt);

  try {
    // Query to fetch submissions for client's jobs
    const result = await pool.query(
      `
      SELECT s.id AS submission_id, s.application_id, s.status AS submission_status, s.comments AS submission_comments, s.created_at AS submission_created_at,
             j.title AS job_title, f.first_name || ' ' || f.last_name AS freelancer_name
      FROM submissions s
      JOIN applications a ON s.application_id = a.id
      JOIN jobposts j ON a.jobpost_id = j.id
      JOIN users f ON a.freelancer_id = f.id
      WHERE j.client_id = $1
      `,
      [clientIdInt]
    );

    console.log("Query result:", result.rows); // Log result for debugging
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error); // Log error to console for debugging
    res.status(500).json({ message: 'Error fetching submissions for client', error: error.message });
  }
});

// Submit Work
router.post('/submit-work', async (req, res) => {
  const { applicationId, comments } = req.body;

  if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
  }

  try {
      const result = await pool.query(
          `INSERT INTO submissions (application_id, comments, status) 
           VALUES ($1, $2, 'илгээгдсэн') RETURNING *`,
          [applicationId, comments]
      );
      res.status(201).json({ message: 'Материал амжилттай илгээгдлээ', submission: result.rows[0] });
  } catch (error) {
      console.error('Error submitting work:', error);
      res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// Update Submission Status
router.put('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['илгээгдсэн', 'засвар_хүссэн', 'баталгаажсан'];
  if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Буруу статус' });
  }

  try {
      const result = await pool.query(
          `UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
          [status, id]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Илгээмж олдсонгүй' });
      }

      res.status(200).json({ message: 'Статус амжилттай шинэчлэгдлээ', submission: result.rows[0] });
  } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// GET submissions and application status for freelancer.
router.get('/freelancer', async (req, res) => {
  const { freelancerId } = req.query;

  // Convert freelancerId to integer and validate
  const freelancerIdInt = parseInt(freelancerId, 10);
  if (isNaN(freelancerIdInt)) {
    return res.status(400).json({ message: 'Invalid freelancer ID' });
  }

  console.log("Fetching submissions for freelancer with ID:", freelancerIdInt);

  try {
    // Query to fetch only freelancer's submissions
    const result = await pool.query(
      `
      SELECT s.id AS submission_id, s.application_id, s.status AS submission_status, s.comments AS submission_comments, s.created_at AS submission_created_at
      FROM submissions s
      WHERE s.application_id IN (
        SELECT a.id
        FROM applications a
        WHERE a.freelancer_id = $1
      )
      `,
      [freelancerIdInt]
    );

    console.log("Query result:", result.rows); // Log result for debugging
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error); // Log error to console for debugging
    res.status(500).json({ message: 'Error fetching submissions for freelancer', error: error.message });
  }
});

// Endpoint to approve job completion and release payment
router.post('/approve', async (req, res) => {
  const { clientId } = req.body; // Get clientId from the request

  if (!clientId) {
    return res.status(400).json({ error: "Client ID is required." });
  }

  const client = await pool.connect(); // Get a client from the pool

  try {
    // Step 1: Find the payment for the given client
    const paymentResult = await client.query(
      'SELECT * FROM payments WHERE client_id = $1 AND status = $2 LIMIT 1',
      [clientId, 'in_escrow']
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: "No payment found in escrow for the provided client." });
    }

    const payment = paymentResult.rows[0]; // Get the payment

    // Step 2: Find the associated submission for this payment
    const submissionResult = await client.query(
      'SELECT * FROM submissions WHERE application_id = $1 LIMIT 1',
      [payment.application_id]
    );

    if (submissionResult.rows.length === 0) {
      return res.status(404).json({ error: "Холбогдох төлбөртэй холбоотой фрилансерын хүсэлт олдсонгүй." });
    }

    const submission = submissionResult.rows[0]; // Get the submission

    // Step 3: Update payment status to 'completed'
    await client.query(
      'UPDATE payments SET status = $1, completed_at = $2 WHERE id = $3',
      ['completed', new Date(), payment.id]
    );

    // Step 4: Update submission status to 'баталгаажсан' (approved)
    await client.query(
      'UPDATE submissions SET status = $1, updated_at = $2 WHERE id = $3',
      ['баталгаажсан', new Date(), submission.id]
    );

    // Step 5: Send success response
    res.status(200).json({ message: "Ажлыг зөвшөөрч, төлбөрийг фрилансерт шилжүүлсэн." });

  } catch (error) {
    console.error("Error approving job:", error);
    res.status(500).json({ error: "An error occurred while processing the approval." });
  } finally {
    client.release(); // Make sure to release the client back to the pool
  }
}); 


export default router;
