import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import challengeRoutes from './routes/challengeRoutes';
import ideaRoutes from './routes/ideaRoutes';
import commentRoutes from './routes/commentRoutes';
import ratingRoutes from './routes/ratingRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import pilotRoutes from './routes/pilotRoutes';
import statusRoutes from './routes/statusRoutes';
import documentRoutes from './routes/documentRoutes';
import messageRoutes from './routes/messageRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pilot', pilotRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('GovSpark Connect API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
