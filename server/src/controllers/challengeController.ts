import { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import Idea from '../models/Idea';

// @desc    Create a new challenge
// @route   POST /api/challenges
// @access  Private (Government only)
export const createChallenge = async (req: Request, res: Response) => {
    try {
        const { title, description, department, sector } = req.body;

        const user = (req as any).user;
        if (!user || user.role !== 'government') {
            return res.status(403).json({ message: 'Not authorized as government' });
        }

        const challenge = await Challenge.create({
            title,
            description,
            department,
            sector,
            createdBy: user._id,
        });

        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
export const getChallenges = async (req: Request, res: Response) => {
    try {
        const challenges = await Challenge.find().sort({ createdAt: -1 });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
export const getChallengeById = async (req: Request, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.id).populate('createdBy', 'username organization');

        if (challenge) {
            res.json(challenge);
        } else {
            res.status(404).json({ message: 'Challenge not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private (Government only)
export const deleteChallenge = async (req: Request, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Check ownership
        const user = (req as any).user;
        if (!user || challenge.createdBy.toString() !== (user._id as unknown as string)) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await challenge.deleteOne();
        res.json({ message: 'Challenge removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
