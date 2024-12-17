import express from 'express';
import pool from '../../db/pool.js'; 
// import multer from 'multer';
// import path from 'path';

const router = express.Router();

// Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Ensure a unique filename
//   }
// });

// const upload = multer({ storage });

// POST /api/jobPost      -- for jobPost register
router.post('/', async (req, res) => {
  console.log("Request Body Received:", req.body);
  // console.log("Files Received:", req.files);

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
    client_id
  } = req.body;

  // Handle file path and ensure it's valid
  // const filePath = req.file ? req.file.path : null;

  // Check required fields
  if (!title || !description || !skills || !deadline || !subDeadline || !projectType || !budgetType || !client_id) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  // ensure its number
  const clientIdValue = parseInt(client_id, 10);
  if (isNaN(clientIdValue)) {
    return res.status(400).json({ error: 'Invalid client_id format.' });
  }


  // Ensure `skills` is a valid array
  let parsedSkills = [];
  try {
    if (typeof skills === 'string') {
      // Parse only if skills is a string
      parsedSkills = JSON.parse(skills);
    } else if (Array.isArray(skills)) {
      parsedSkills = skills; // Already an array
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid skills format.' });
  }

  // Handle optional fields
  const hourlyRateFromValue = hourlyRateFrom === 'null' || hourlyRateFrom === '' ? null : parseFloat(hourlyRateFrom);
  const hourlyRateToValue = hourlyRateTo === 'null' || hourlyRateTo === '' ? null : parseFloat(hourlyRateTo);
  const projectMaxBudgetValue = projectMaxBudget === 'null' || projectMaxBudget === '' ? null : parseFloat(projectMaxBudget);

  console.log({
    title,
    description,
    parsedSkills,
    deadline,
    subDeadline,
    projectType,
    budgetType,
    hourlyRateFromValue,
    hourlyRateToValue,
    projectMaxBudgetValue,
    client_id
    // filePath,
  });

  try {
    // Insert job post into the database
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
        project_max_budget,
        client_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        title,
        description,
        parsedSkills, // Pass the array directly
        deadline,
        subDeadline,
        projectType,
        budgetType,
        hourlyRateFromValue,
        hourlyRateToValue,
        projectMaxBudgetValue,
        client_id
      ]
    );

    const jobPostId = result.rows[0].id;

    // Insert file information into the jobpost_files table
    // await pool.query(
    //   `INSERT INTO jobpost_files (job_post_id, file_path) VALUES ($1, $2)`,
    //   [jobPostId, filePath]
    // );

    res.status(201).json({ message: 'Job post created successfully.', jobPostId });
  } catch (error) {
    console.error('Error inserting job post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/jobPosts   -- for solely fetching client 
router.get('/all', async (req, res) => {
  const { clientId } = req.query; // Retrieve clientId from query parameters

  try {
    let result;
    if (clientId) {
      // If clientId is provided, fetch job posts for that specific client
      result = await pool.query(
        'SELECT * FROM jobposts WHERE client_id = $1 AND ishidden = FALSE',
        [clientId]
      );
    } else {
      // Otherwise, fetch all job posts
      result = await pool.query('SELECT * FROM jobposts WHERE ishidden = FALSE');
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/search   -- for search and fetching [for freelancer]
router.get('/all/search', async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = "SELECT * FROM jobposts";
    const queryParams = [];

    if (search) {
      query += ' WHERE title ILIKE $1 OR description ILIKE $1';
      queryParams.push(`%${search}%`);
    }

    // Execute query
    const result = await pool.query(query, queryParams);

    // Send the job posts as a response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: "Internal Server Error"});
    
  }
});

// PATCH /api/jobPost/:id/hide     -- for delete
router.patch('/:id/hide', async (req, res) => {
  const jobId = req.params.id;

  try {
    const result = await pool.query('UPDATE jobposts SET isHidden = true WHERE id = $1 RETURNING id', [jobId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Job post not found.' });
    }

    res.status(200).json({ message: 'Job post hidden successfully.', jobId });
  } catch (error) {
    console.error('Error hiding job post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/jobPosts/:id -- for freelance application 
router.get('/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM jobposts WHERE id = $1', [jobId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Job post not found.' });
    }

    res.status(200).json(result.rows[0]);
    console.log('Job ID:', jobId);
  } catch (error) {
    console.error('Error fetching job post by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
