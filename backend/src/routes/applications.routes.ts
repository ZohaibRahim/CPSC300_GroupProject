import { Router } from 'express';
import * as applicationsController from '../controllers/applications.controller';

const router = Router();

// Get all applications for a user
router.get('/', applicationsController.getAllApplications);

// Get a single application by ID
router.get('/:id', applicationsController.getApplicationById);

// Get applications for a specific job
router.get('/job/:jobId', applicationsController.getApplicationsByJobId);

// Create a new application
router.post('/', applicationsController.createApplication);

// Update an application
router.put('/:id', applicationsController.updateApplication);

// Delete an application
router.delete('/:id', applicationsController.deleteApplication);

export default router;

