import { Request, Response } from 'express';
import Message from '../models/Message';
import Idea from '../models/Idea';

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { ideaId, receiverId, subject, content } = req.body;
        const user = (req as any).user;

        const idea = await Idea.findById(ideaId).populate('submittedBy');
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Validate sender/receiver relationship
        const isGovernment = user.role === 'government';
        const isEntrepreneur = user.role === 'entrepreneur';
        const isIdeaOwner = idea.submittedBy._id.toString() === user._id.toString();

        if (isEntrepreneur && !isIdeaOwner) {
            return res.status(403).json({ message: 'Not authorized to message about this idea' });
        }

        const message = await Message.create({
            ideaId,
            sender: user._id,
            receiver: receiverId,
            subject,
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username role organization')
            .populate('receiver', 'username role organization');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get messages for an idea
// @route   GET /api/messages/:ideaId
// @access  Private
export const getMessages = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const idea = await Idea.findById(req.params.ideaId);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Only allow government or idea owner to view messages
        const isGovernment = user.role === 'government';
        const isIdeaOwner = idea.submittedBy.toString() === user._id.toString();

        if (!isGovernment && !isIdeaOwner) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const messages = await Message.find({ ideaId: req.params.ideaId })
            .populate('sender', 'username role organization')
            .populate('receiver', 'username role organization')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.receiver.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const count = await Message.countDocuments({
            receiver: user._id,
            isRead: false
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
