import express from 'express';
import { sendMessage, getMessages, markAsRead, getUnreadCount } from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:ideaId', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.get('/unread/count', protect, getUnreadCount);

export default router;
