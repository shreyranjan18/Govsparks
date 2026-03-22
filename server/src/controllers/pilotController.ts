import { Request, Response } from 'express';
import PilotRequest from '../models/PilotRequest';
import Idea from '../models/Idea';

// @desc    Request pilot for an idea
// @route   POST /api/pilot/request
// @access  Private (Government only)
export const requestPilot = async (req: Request, res: Response) => {
    try {
        const { ideaId, message } = req.body;
        const user = (req as any).user;

        if (!user || user.role !== 'government') {
            return res.status(403).json({ message: 'Only government users can request pilots' });
        }

        const idea = await Idea.findById(ideaId).populate('submittedBy');
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if pilot request already exists
        const existing = await PilotRequest.findOne({ ideaId, status: 'pending' });
        if (existing) {
            return res.status(400).json({ message: 'Pilot request already pending' });
        }

        const pilotRequest = await PilotRequest.create({
            ideaId,
            requestedBy: user._id,
            entrepreneurId: idea.submittedBy,
            message
        });

        res.status(201).json(pilotRequest);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Respond to pilot request
// @route   PUT /api/pilot/respond/:id
// @access  Private (Entrepreneur only)
export const respondToPilotRequest = async (req: Request, res: Response) => {
    try {
        const { status, responseMessage } = req.body;
        const user = (req as any).user;

        const pilotRequest = await PilotRequest.findById(req.params.id);
        if (!pilotRequest) {
            return res.status(404).json({ message: 'Pilot request not found' });
        }

        if (pilotRequest.entrepreneurId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        pilotRequest.status = status;
        pilotRequest.responseMessage = responseMessage;
        pilotRequest.respondedAt = new Date();
        await pilotRequest.save();

        // Update idea status if accepted
        if (status === 'accepted') {
            await Idea.findByIdAndUpdate(pilotRequest.ideaId, {
                status: 'pilot',
                isPilotActive: true,
                $push: {
                    statusHistory: {
                        status: 'pilot',
                        changedAt: new Date(),
                        changedBy: user._id
                    }
                }
            });
        }

        res.json(pilotRequest);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get pilot requests
// @route   GET /api/pilot/my-requests
// @access  Private
export const getMyPilotRequests = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        const query = user.role === 'government'
            ? { requestedBy: user._id }
            : { entrepreneurId: user._id };

        const requests = await PilotRequest.find(query)
            .populate('ideaId', 'title description')
            .populate('requestedBy', 'username organization')
            .populate('entrepreneurId', 'username organization')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
