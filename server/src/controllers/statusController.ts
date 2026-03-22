import { Request, Response } from 'express';
import Idea from '../models/Idea';

// @desc    Update idea status
// @route   PUT /api/status/:ideaId
// @access  Private (Government only)
export const updateIdeaStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== 'government') {
            return res.status(403).json({ message: 'Only government users can update status' });
        }

        const idea = await Idea.findById(req.params.ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        idea.status = status;
        idea.statusHistory.push({
            status,
            changedAt: new Date(),
            changedBy: user._id
        });

        // Update shortlist count on challenge if shortlisted
        if (status === 'shortlisted') {
            const Challenge = require('../models/Challenge').default;
            await Challenge.findByIdAndUpdate(idea.challengeId, {
                $inc: { shortlistCount: 1 }
            });
        }

        await idea.save();
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get status history for an idea
// @route   GET /api/status/:ideaId/history
// @access  Private
export const getStatusHistory = async (req: Request, res: Response) => {
    try {
        const idea = await Idea.findById(req.params.ideaId)
            .populate('statusHistory.changedBy', 'username organization');

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        res.json(idea.statusHistory);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
