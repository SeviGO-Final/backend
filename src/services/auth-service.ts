import User from '../models/User'; // Adjust the import path as needed
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {toUserResponse} from "../formatters/user-formatter";

export const register = async (name: string, email: string, password: string, nik: string) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const existingNIK = await User.findOne({ nik });
    if (existingNIK) {
        throw new Error('User with this NIK already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, nik });
    await newUser.save();

    return toUserResponse(newUser.toObject());
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user || !user.is_verified) {
        throw new Error('User not verified or does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
};

