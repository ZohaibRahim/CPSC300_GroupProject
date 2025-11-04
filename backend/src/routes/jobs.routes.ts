import { Router } from 'express';
import * as jobsController from '../controllers/jobs.controller';

const router = Router();

// Get all jobs for a user
router.get('/', jobsController.getAllJobs);

// Get a single job by ID
router.get('/:id', jobsController.getJobById);

// Create a new job
router.post('/', jobsController.createJob);

// Update a job
router.put('/:id', jobsController.updateJob);

// Delete a job
router.delete('/:id', jobsController.deleteJob);

export default router;

