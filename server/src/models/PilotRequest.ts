import mongoose, { Schema, Document } from 'mongoose';

export interface IPilotRequest extends Document {
    ideaId: mongoose.Types.ObjectId;
    requestedBy: mongoose.Types.ObjectId;
    entrepreneurId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    responseMessage?: string;
    createdAt: Date;
    respondedAt?: Date;
}

const PilotRequestSchema: Schema = new Schema({
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entrepreneurId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String },
    responseMessage: { type: String },
    createdAt: { type: Date, default: Date.now },
    respondedAt: { type: Date }
});

export default mongoose.model<IPilotRequest>('PilotRequest', PilotRequestSchema);
