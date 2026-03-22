import mongoose, { Schema, Document } from 'mongoose';

export interface IIdea extends Document {
    title: string;
    description: string;
    techStack: string;
    cost: number;
    impact: string;
    status: 'submitted' | 'under review' | 'shortlisted' | 'pilot' | 'approved' | 'rejected';
    challengeId: mongoose.Types.ObjectId;
    submittedBy: mongoose.Types.ObjectId;
    qualityScore?: number;
    ratingCount: number;
    isPilotActive: boolean;
    statusHistory: Array<{
        status: string;
        changedAt: Date;
        changedBy?: mongoose.Types.ObjectId;
    }>;
    createdAt: Date;
}

const IdeaSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: String, required: true },
    cost: { type: Number, required: true },
    impact: { type: String, required: true },
    status: {
        type: String,
        enum: ['submitted', 'under review', 'shortlisted', 'pilot', 'approved', 'rejected'],
        default: 'submitted'
    },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    qualityScore: { type: Number, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isPilotActive: { type: Boolean, default: false },
    statusHistory: [{
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IIdea>('Idea', IdeaSchema);
