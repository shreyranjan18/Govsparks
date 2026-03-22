import express from 'express';
import { getChallenges, createChallenge, deleteChallenge, getChallengeById } from '../controllers/challengeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getChallenges);
router.post('/', protect, createChallenge);
router.delete('/:id', protect, deleteChallenge);
router.get('/:id', getChallengeById);

export default router;
