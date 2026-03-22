import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    ideaId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    subject: string;
    content: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
