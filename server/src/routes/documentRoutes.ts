import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/:ideaId', protect, getDocuments);
router.delete('/:id', protect, deleteDocument);

export default router;
