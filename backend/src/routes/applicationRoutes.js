import express from 'express';
import { applyForJob, getJobApplicants, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, applyForJob);
router.get('/job/:jobId', protect, getJobApplicants);
router.put('/:id/status', protect, updateApplicationStatus);

export default router;
