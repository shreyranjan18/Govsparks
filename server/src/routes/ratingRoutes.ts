import express from 'express';
import { rateIdea, getIdeaRatings } from '../controllers/ratingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, rateIdea);
router.get('/:ideaId', protect, getIdeaRatings);

export default router;
