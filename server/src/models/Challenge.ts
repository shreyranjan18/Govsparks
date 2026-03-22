import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
    title: string;
    description: string;
    department: string;
    sector: string;
    status: 'open' | 'closed';
    createdBy: mongoose.Types.ObjectId;
    views: number;
    submissionCount: number;
    shortlistCount: number;
    engagementScore: number;
    requiresNDA: boolean;
    termsAndConditions?: string;
    createdAt: Date;
}

const ChallengeSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    sector: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    submissionCount: { type: Number, default: 0 },
    shortlistCount: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    requiresNDA: { type: Boolean, default: false },
    termsAndConditions: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
