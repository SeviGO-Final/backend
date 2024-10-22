import mongoose, { Document, Schema } from 'mongoose';
interface IUser extends Document {
    nik: number;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    role: string;
    is_verified: boolean;
}
const userSchema: Schema<IUser> = new Schema(
    {
        nik: { type: Number, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: null }, // Default ke null
        role: { type: String, default: 'user' }, // 'user' or 'admin'
        is_verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
