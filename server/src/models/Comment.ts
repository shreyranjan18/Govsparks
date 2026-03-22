import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    ideaId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
