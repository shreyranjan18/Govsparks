import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
    ideaId: mongoose.Types.ObjectId;
    uploadedBy: mongoose.Types.ObjectId;
    fileName: string;
    fileUrl: string;
    fileType: 'pitch_deck' | 'proposal' | 'feedback' | 'other';
    fileSize: number;
    isPrivate: boolean;
    createdAt: Date;
}

const DocumentSchema: Schema = new Schema({
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['pitch_deck', 'proposal', 'feedback', 'other'], required: true },
    fileSize: { type: Number, required: true },
    isPrivate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
