import { Request, Response } from 'express';
import Idea from '../models/Idea';
import Challenge from '../models/Challenge';

// @desc    Submit a new idea
// @route   POST /api/ideas
// @access  Private (Entrepreneur only)
export const createIdea = async (req: Request, res: Response) => {
    try {
        const { title, description, techStack, cost, impact, challengeId } = req.body;

        const user = (req as any).user;
        if (!user || user.role !== 'entrepreneur') {
            return res.status(403).json({ message: 'Not authorized as entrepreneur' });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const idea = await Idea.create({
            title,
            description,
            techStack,
            cost,
            impact,
            challengeId,
            submittedBy: user._id,
        });

        res.status(201).json(idea);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get ideas submitted by current user
// @route   GET /api/ideas/my-ideas
// @access  Private
export const getMyIdeas = async (req: Request, res: Response) => {
    try {
        const ideas = await Idea.find({ submittedBy: (req as any).user._id }).populate('challengeId', 'title');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get ideas for a specific challenge (Government view)
// @route   GET /api/ideas/challenge/:challengeId
// @access  Private
export const getIdeasForChallenge = async (req: Request, res: Response) => {
    try {
        const ideas = await Idea.find({ challengeId: req.params.challengeId }).populate('submittedBy', 'username organization');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

// @desc    Get single idea by ID
// @route   GET /api/ideas/:id
// @access  Private
export const getIdeaById = async (req: Request, res: Response) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('submittedBy', 'username organization')
            .populate('challengeId', 'title department');

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
