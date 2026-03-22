import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password, role, organization } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            organization,
        });

        if (user) {
            res.status(201).json({
                _id: (user._id as unknown as string),
                username: user.username,
                email: user.email,
                role: user.role,
                organization: user.organization,
                token: generateToken((user._id as unknown as string)),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password as string))) {
            res.json({
                _id: (user._id as unknown as string),
                username: user.username,
                email: user.email,
                role: user.role,
                organization: user.organization,
                token: generateToken((user._id as unknown as string)),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userReq = (req as any).user;
        if (!userReq) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const user = await User.findById(userReq._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
