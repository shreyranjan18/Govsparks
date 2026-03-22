import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Idea from '../models/Idea';

// @desc    Add a comment to an idea
// @route   POST /api/comments
// @access  Private
export const addComment = async (req: Request, res: Response) => {
    try {
        const { content, ideaId } = req.body;

        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const comment = await Comment.create({
            content,
            ideaId,
            author: (req as any).user?._id,
        });

        const populatedComment = await Comment.findById(comment._id).populate('author', 'username role');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get comments for an idea
// @route   GET /api/comments/:ideaId
// @access  Private
export const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ ideaId: req.params.ideaId })
            .populate('author', 'username role')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
