import {LoginUserRequest, RegisterUserRequest} from "../../src/formatters/user-formatter";

export class MockData {
    static USER = {
        _id: '507f191e810c19729de860ea',
        nik: '1234567890123456',
        name: 'Tony Stark',
        email: 'stark@example.com',
        password: 'hashedPassword123',
        role: 'user',
        is_verified: true,
    }

    static REGISTER: RegisterUserRequest = {
        nik: '1234567890123456',
        name: 'Tony Stark',
        email: 'stark@example.com',
        password: 'password123',
    }

    static LOGIN: LoginUserRequest = {
        email: 'stark@example.com',
        password: `Password123`
    }
}