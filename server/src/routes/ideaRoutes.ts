import express from 'express';
import { createIdea, getMyIdeas, getIdeasForChallenge, getIdeaById } from '../controllers/ideaController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createIdea);
router.get('/my-ideas', protect, getMyIdeas);
router.get('/challenge/:challengeId', protect, getIdeasForChallenge);
router.get('/:id', protect, getIdeaById);

export default router;
