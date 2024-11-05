import User from '../models/User'; // Adjust the import path as needed
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse} from "../formatters/user-formatter";
import {Validation} from "../validations/schema";
import {UserValidation} from "../validations/user-validation";
import {CustomErrors} from "../exceptions/custom-errors";

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        // validating the request body, if error will return ZodError
        const requestValidated = Validation.validate(UserValidation.REGISTER, request);
        const { nik, email, name, password} = requestValidated;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomErrors(409, "Conflict", "User already exists");
        }

        const existingNIK = await User.findOne({ nik });
        if (existingNIK) {
            throw new CustomErrors(409, "Conflict", "User with this NIK already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await new User({ name, email, password: hashedPassword, nik }).save();

        return toUserResponse(newUser);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        // validating the request body, if error will return ZodError
        const requestValidated = Validation.validate(UserValidation.LOGIN, request);
        const { email, password } = requestValidated;

        const user = await User.findOne({ email });
        if (!user || !user.is_verified) {
            throw new CustomErrors(401, "Unauthorized", "User not verified or does not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomErrors(401, "Unauthorized", "Email or password is wrong");
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        const response = toUserResponse(user);
        response.token = token;

        return response;
    }

    static async verifyUser(userId: string) {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            throw new CustomErrors(404, "Not Found", "User not found");
        }

        user.is_verified = true;
        await user.save();
        
        return user.toObject();
    }
    
}

