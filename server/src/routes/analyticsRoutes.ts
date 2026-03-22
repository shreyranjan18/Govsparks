import express from 'express';
import { getDashboardAnalytics, updateEngagementScore } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);
router.put('/engagement/:challengeId', protect, updateEngagementScore);

export default router;
