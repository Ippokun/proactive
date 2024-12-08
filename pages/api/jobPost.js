const express = require('express');
const router = express.Router();
const pool = require('../../db/pool'); // PostgreSQL pool for queries
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for file attachments

// Route: POST /api/jobPost
router.post('/', async (req, res) => {
  const {
    title,
    description,
    skills,
    deadline,
    subDeadline,
    projectType,
    budgetType,
    hourlyRateFrom,
    hourlyRateTo,
    projectMaxBudget,
  } = req.body;  // assuming it's a JSON body

  // Validation: Check if all required fields are provided
  if (
    !title ||
    !description ||
    !skills ||
    !deadline ||
    !subDeadline ||
    !projectType ||
    !budgetType
  ) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  // Handling nullable fields: if a number is null, insert null into DB
  const hourlyRateFromValue = hourlyRateFrom ? parseFloat(hourlyRateFrom) : null;
  const hourlyRateToValue = hourlyRateTo ? parseFloat(hourlyRateTo) : null;
  const projectMaxBudgetValue = projectMaxBudget ? parseFloat(projectMaxBudget) : null;

  try {
    // Insert job post data into the database
    const result = await pool.query(
      `INSERT INTO jobposts (
        title,
        description,
        skills,
        deadline,
        sub_deadline,
        project_type,
        budget_type,
        hourly_rate_from,
        hourly_rate_to,
        project_max_budget
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        title,
        description,
        JSON.stringify(skills), // Convert skills array to JSON
        deadline,
        subDeadline,
        projectType,
        budgetType,
        hourlyRateFromValue,
        hourlyRateToValue,
        projectMaxBudgetValue,
      ]
    );

    const jobPostId = result.rows[0].id;

    // Handle file attachments (if any)
    if (req.files && req.files.length > 0) {
      const filePromises = req.files.map(async (file) => {
        const attachmentId = uuidv4(); // Generate a unique ID for the file

        // Insert the attachment information (assuming file path or file name is stored)
        await pool.query(
          `INSERT INTO jobpost_attachments (jobpost_id, attachment_id, file_name) VALUES ($1, $2, $3)`,
          [jobPostId, attachmentId, file.filename]  // Store file path or name
        );
      });

      // Wait for all file insertions to complete
      await Promise.all(filePromises);
    }

    // Respond with success message
    res.status(201).json({ message: 'Job post created successfully.' });
  } catch (error) {
    console.error('Error inserting job post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
