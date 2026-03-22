import express from 'express';
import { updateIdeaStatus, getStatusHistory } from '../controllers/statusController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/:ideaId', protect, updateIdeaStatus);
router.get('/:ideaId/history', protect, getStatusHistory);

export default router;
