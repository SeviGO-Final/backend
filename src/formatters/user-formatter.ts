import User, {IUser} from "../models/User";

export type RegisterUserRequest = {
    nik: string,
    name: string,
    email: string,
    password: string
}

export type UpdateUserRequest = {
    name: string,
    email: string,
    avatar?: string,
    address?: string,
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
}

export type LoginUserRequest = {
    email: string,
    password: string
}

export type UserResponse = {
    _id: string,
    nik: string,
    name: string,
    email: string,
    role: string;
    is_verified: boolean;
    address?: string;
    avatar?: string;
    token?: string;
    complaints?: any;
}

export type UserSessionData = {
    _id: string;
    role: string;
}

export function toUserResponse(user: IUser): UserResponse {
    return {
        _id: user._id.toString(),
        nik: user.nik,
        name: user.name,
        email: user.email,
        address: user.address ?? undefined,
        role: user.role,
        is_verified: user.is_verified,
    }
}
