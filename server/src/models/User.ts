import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    role: 'government' | 'entrepreneur';
    organization?: string;
    department?: string;
    isVerified: boolean;
    verifiedAt?: Date;
    ndaAccepted: boolean;
    termsAccepted: boolean;
    ipDeclarationAccepted: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['government', 'entrepreneur'], required: true },
    organization: { type: String },
    department: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    ndaAccepted: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    ipDeclarationAccepted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
