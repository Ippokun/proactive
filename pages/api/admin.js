import express from 'express';
import pool from '../../db/pool.js';

const router = express.Router();

// Route: GET /api/admin-dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Query to get all users and count
        const usersQuery = `
            SELECT id, first_name, last_name, email, role, created_at
            FROM users;
        `;
        const usersCountQuery = `
            SELECT COUNT(*) AS total_users FROM users;
        `;

        // Query to get all job posts and count
        const jobPostsQuery = `
            SELECT id, title, description, skills, deadline, project_type, budget_type, created_at
            FROM jobposts;
        `;
        const jobPostsCountQuery = `
            SELECT COUNT(*) AS total_job_posts FROM jobposts;
        `;

        // Execute all queries
        const [usersResult, usersCountResult, jobPostsResult, jobPostsCountResult] = await Promise.all([
            pool.query(usersQuery),
            pool.query(usersCountQuery),
            pool.query(jobPostsQuery),
            pool.query(jobPostsCountQuery)
        ]);

        // Prepare the response data
        const response = {
            totalUsers: usersCountResult.rows[0].total_users,
            users: usersResult.rows,
            totalJobPosts: jobPostsCountResult.rows[0].total_job_posts,
            jobPosts: jobPostsResult.rows
        };

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// GET report users 
router.get('/report/users', async (req, res) => {
    try {
        // Query to get all users and count
        const usersQuery = `
          SELECT id, first_name, last_name, email, role, created_at
          FROM users;
        `;
        const usersCountQuery = `
          SELECT COUNT(*) AS total_users FROM users;
        `;
    
        // Execute all queries concurrently
        const [usersResult, usersCountResult, jobPostsResult, jobPostsCountResult] = await Promise.all([
          pool.query(usersQuery),
          pool.query(usersCountQuery),
        ]);
    
        // Prepare the response data
        const response = {
          totalUsers: usersCountResult.rows[0].total_users,
          users: usersResult.rows,
        };
    
        // Send the response
        res.status(200).json(response);
      } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ message: 'Error fetching report data' });
      }
    });
  
  // GET report jobposts
  router.get('/report/jobposts', async (req, res) => {
    try {
        // Query to get all job posts and count
        const jobPostsQuery = `
          SELECT id, title, description, skills, deadline, project_type, budget_type, created_at
          FROM jobposts;
        `;
        const jobPostsCountQuery = `
          SELECT COUNT(*) AS total_job_posts FROM jobposts;
        `;
    
        // Execute all queries concurrently
        const [jobPostsResult, jobPostsCountResult] = await Promise.all([
          pool.query(jobPostsQuery),
          pool.query(jobPostsCountQuery),
        ]);
    
        // Prepare the response data
        const response = {
          totalJobPosts: jobPostsCountResult.rows[0].total_job_posts,
          jobPosts: jobPostsResult.rows,
        };
    
        // Send the response
        res.status(200).json(response);
      } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ message: 'Error fetching report data' });
      }
    });
  

export default router;
