import { Request, Response } from 'express';
import Document from '../models/Document';
import Idea from '../models/Idea';

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const { ideaId, fileType, isPrivate } = req.body;
        const user = (req as any).user;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check authorization
        if (user.role === 'entrepreneur' && idea.submittedBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const document = await Document.create({
            ideaId,
            uploadedBy: user._id,
            fileName: req.file.originalname,
            fileUrl: (req.file as any).path,
            fileType: fileType || 'other',
            fileSize: req.file.size,
            isPrivate: isPrivate === 'true'
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get documents for an idea
// @route   GET /api/documents/:ideaId
// @access  Private
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const idea = await Idea.findById(req.params.ideaId);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Build query based on user role and permissions
        let query: any = { ideaId: req.params.ideaId };

        if (user.role === 'entrepreneur' && idea.submittedBy.toString() !== user._id.toString()) {
            query.isPrivate = false;
        }

        const documents = await Document.find(query)
            .populate('uploadedBy', 'username role')
            .sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.uploadedBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await document.deleteOne();
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
