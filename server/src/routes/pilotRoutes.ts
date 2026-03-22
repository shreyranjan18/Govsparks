import express from 'express';
import { requestPilot, respondToPilotRequest, getMyPilotRequests } from '../controllers/pilotController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/request', protect, requestPilot);
router.put('/respond/:id', protect, respondToPilotRequest);
router.get('/my-requests', protect, getMyPilotRequests);

export default router;
