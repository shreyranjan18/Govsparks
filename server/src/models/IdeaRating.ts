import mongoose, { Schema, Document } from 'mongoose';

export interface IIdeaRating extends Document {
    ideaId: mongoose.Types.ObjectId;
    ratedBy: mongoose.Types.ObjectId;
    score: number; // 1-5
    feedback?: string;
    createdAt: Date;
}

const IdeaRatingSchema: Schema = new Schema({
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    ratedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IIdeaRating>('IdeaRating', IdeaRatingSchema);
