import mongoose, { Document, Schema, Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    nik: string;
    name: string;
    email: string;
    password: string;
    address?: string | null;
    avatar?: string | null;
    role: string;
    is_verified: boolean;
}
const userSchema: Schema<IUser> = new Schema(
    {
        nik: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, default: null },
        avatar: { type: String, default: null }, // Default ke null
        role: { type: String, default: 'user' }, // 'user' or 'admin'
        is_verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
