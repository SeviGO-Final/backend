import User from '../models/User'; // Adjust the import path as needed
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserSessionData,
    UserResponse, UpdateUserRequest
} from "../formatters/user-formatter";
import {Validation} from "../validations/schema";
import {UserValidation} from "../validations/user-validation";
import {CustomErrors} from "../types/custom-errors";
import {getEnv} from "../utils/getenv";
import {Types} from "mongoose";
import {Complaint} from "../models/Complaint";
import {toComplaintResponses} from "../formatters/complaint-formatter";
import {ServiceUtils} from "../utils/service-utils";
import path from "path";
import fs from "fs";

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

        const jwtPayload: UserSessionData = {
            _id: user._id.toString(),
            role: user.role,
        }
        const token = jwt.sign(jwtPayload, getEnv('JWT_SECRET'), { expiresIn: '1d' });

        const response = toUserResponse(user);
        response.token = token;
        if(user.address) {
            response.address = user.address;
        }
        return response;
    }

    static async update(file: Express.Multer.File | undefined, request: UpdateUserRequest, userId: string) {
        ServiceUtils.isValidObjectId(userId);

        const validRequest = Validation.validate(UserValidation.UPDATE, request);
        const findById = await User.findById(userId);
        if (!findById) {
            throw new CustomErrors(404, 'Not Found', 'User not found');
        }

        const isUsedEmail = await User.findOne({ email: validRequest.email });
        if (isUsedEmail && isUsedEmail._id.toString() !== userId) {
            throw new CustomErrors(409, 'Conflict', 'Email already used');
        }

        // update password validation
        if (validRequest.new_password) {
            // matching old password
            const isCorrectOldPassword = await bcrypt.compare(validRequest.old_password!, findById.password);
            if (!isCorrectOldPassword) {
                throw new CustomErrors(401, 'Unauthorized', 'Incorrect old password');
            }

            if (validRequest.new_password === validRequest.old_password) {
                throw new CustomErrors(400, 'Bad Request', "New password can't be the same with old password");
            }

            if (validRequest.confirm_password !== validRequest.new_password) {
                throw new CustomErrors(400, 'Bad Request', "Confirm password not same with new password");
            }

            findById.password = await bcrypt.hash(validRequest.new_password, 10);
        }

        // Save file to disk (if exists)
        const filePath = path.join(__dirname, '../../uploads/avatars', `${Date.now()}-${file?.originalname}`);

        try {
            if(file) {
                const uploadDir = path.join(__dirname, '../../uploads/avatars');

                // if uploadDir not exists, create it
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // set file size limits
                if (file.size > ServiceUtils.MAX_SIZE) {
                    throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
                }
    
                // store new avatar
                fs.writeFileSync(filePath, file!.buffer);
                
                // delete old avatar
                if (findById.avatar) {
                    const oldAvatar = path.join(__dirname, '../../', findById.avatar);
                    fs.unlinkSync(oldAvatar);            
                }                

                findById.avatar = `uploads/avatars/${path.basename(filePath)}`;
            }

            // save user
            findById.name = validRequest.name;
            findById.email = validRequest.email;
            findById.address = validRequest.address;
            await findById.save();

            const response = toUserResponse(findById);
            if(findById.avatar) {
                response.avatar = findById.avatar;
            }            

            return response;
        } catch (e) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error(`An error occurred while updating user: ${(e as Error).message}`);
        }
    }

    static async getById(userId: string) {
        ServiceUtils.isValidObjectId(userId);

        const findById = await User.findById(userId);
        if (!findById) {
            throw new CustomErrors(404, 'Not Found', 'User not found');
        }

        const response = toUserResponse(findById);        
        if (findById.avatar) {
            response.avatar = findById.avatar;
        }

        return response;
    }

    static async getAllUsers(sessionData: UserSessionData, page: number, limit: number) {
        const skip = (page - 1) * limit;

        ServiceUtils.onlyAdminCan(sessionData, 'Only admin can access all users');

        const usersPerPage = await User.find({}).skip(skip).limit(limit);

        const totalUsers = await User.countDocuments({});

        return {
            total: totalUsers,
            users: usersPerPage.map(user => toUserResponse(user))
        };
    }

    static async verifyUser(userId: string, sessionData: UserSessionData) {
        // memastikan hanya admin yang bisa melakukan verifikasi akun user
        ServiceUtils.onlyAdminCan(sessionData, 'Only admin can verify user accounts');

        // jika benar-benar Admin
        const user = await User.findById(userId).select('-password');

        if (!user) {
            throw new CustomErrors(404, "Not Found", "User not found");
        }

        user.is_verified = true;
        await user.save();
        
        return toUserResponse(user);
    }

    static async getComplaintsByUserId(userId: string) {
        ServiceUtils.isValidObjectId(userId);

        const user = await User.findById(userId);
        if (!user) {
            throw new CustomErrors(404, "Not Found", "User not found");
        }

        const complaints = await Complaint.find({
          user: userId,
          is_deleted: false,
        });

        const response = toUserResponse(user);
        response.complaints = toComplaintResponses(complaints);

        return response;
    }

    static async delete(userId: string, sessionData: UserSessionData) {
        ServiceUtils.isValidObjectId(userId);
        ServiceUtils.onlyAdminCan(sessionData, 'Only admin can delete user');

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new CustomErrors(404, 'Not Found', 'User not found');
        }

        return {
            _id: user?._id,
            email: user?.email,
            is_deleted: true,
        }
    }
}

