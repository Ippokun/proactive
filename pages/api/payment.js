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

export default router;
