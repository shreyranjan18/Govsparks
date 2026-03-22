import { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import Idea from '../models/Idea';
import Comment from '../models/Comment';

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (user.role === 'government') {
            // Government analytics
            const challenges = await Challenge.find({ createdBy: user._id });
            const challengeIds = challenges.map(c => c._id);

            const ideas = await Idea.find({ challengeId: { $in: challengeIds } });
            const totalSubmissions = ideas.length;
            const avgQualityScore = ideas.reduce((sum, i) => sum + (i.qualityScore || 0), 0) / (ideas.length || 1);

            // Submission trends (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const trendData = await Idea.aggregate([
                { $match: { challengeId: { $in: challengeIds }, createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Sector heatmap
            const sectorData = await Challenge.aggregate([
                { $match: { createdBy: user._id } },
                {
                    $group: {
                        _id: "$sector",
                        challengeCount: { $sum: 1 },
                        totalSubmissions: { $sum: "$submissionCount" },
                        avgEngagement: { $avg: "$engagementScore" }
                    }
                }
            ]);

            res.json({
                totalChallenges: challenges.length,
                totalSubmissions,
                avgQualityScore: avgQualityScore.toFixed(2),
                submissionTrends: trendData,
                sectorHeatmap: sectorData
            });
        } else {
            // Entrepreneur analytics
            const myIdeas = await Idea.find({ submittedBy: user._id });
            const statusBreakdown = myIdeas.reduce((acc: any, idea) => {
                acc[idea.status] = (acc[idea.status] || 0) + 1;
                return acc;
            }, {});

            res.json({
                totalSubmissions: myIdeas.length,
                avgQualityScore: (myIdeas.reduce((sum, i) => sum + (i.qualityScore || 0), 0) / (myIdeas.length || 1)).toFixed(2),
                statusBreakdown,
                activePilots: myIdeas.filter(i => i.isPilotActive).length
            });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Calculate and update engagement score for a challenge
// @route   PUT /api/analytics/engagement/:challengeId
// @access  Private
export const updateEngagementScore = async (req: Request, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const ideas = await Idea.find({ challengeId: challenge._id });
        const comments = await Comment.find({
            ideaId: { $in: ideas.map(i => i._id) }
        });

        // Engagement formula: (submissions * 2) + (comments * 1.5) + (views * 0.5) + (shortlists * 3)
        const engagementScore =
            (challenge.submissionCount * 2) +
            (comments.length * 1.5) +
            (challenge.views * 0.5) +
            (challenge.shortlistCount * 3);

        challenge.engagementScore = Math.round(engagementScore);
        await challenge.save();

        res.json({ engagementScore: challenge.engagementScore });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
