import { Request, Response } from 'express';
import IdeaRating from '../models/IdeaRating';
import Idea from '../models/Idea';

// @desc    Rate an idea
// @route   POST /api/ratings
// @access  Private (Government only)
export const rateIdea = async (req: Request, res: Response) => {
    try {
        const { ideaId, score, feedback } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== 'government') {
            return res.status(403).json({ message: 'Only government users can rate ideas' });
        }

        // Check if already rated
        const existingRating = await IdeaRating.findOne({ ideaId, ratedBy: user._id });

        if (existingRating) {
            existingRating.score = score;
            existingRating.feedback = feedback;
            await existingRating.save();
        } else {
            await IdeaRating.create({
                ideaId,
                ratedBy: user._id,
                score,
                feedback
            });
        }

        // Update idea's quality score
        const ratings = await IdeaRating.find({ ideaId });
        const avgScore = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

        await Idea.findByIdAndUpdate(ideaId, {
            qualityScore: avgScore,
            ratingCount: ratings.length
        });

        res.json({ message: 'Rating submitted successfully', avgScore });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get ratings for an idea
// @route   GET /api/ratings/:ideaId
// @access  Private
export const getIdeaRatings = async (req: Request, res: Response) => {
    try {
        const ratings = await IdeaRating.find({ ideaId: req.params.ideaId })
            .populate('ratedBy', 'username organization')
            .sort({ createdAt: -1 });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
