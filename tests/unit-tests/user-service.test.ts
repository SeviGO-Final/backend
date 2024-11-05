import User from "../../src/models/User";
// @ts-ignore
import bcrypt from "bcryptjs";
// @ts-ignore
import jwt from "jsonwebtoken";
import {MockData} from "./mock-data";
import {UserService} from "../../src/services/user-service";
import {CustomErrors} from "../../src/types/custom-errors";
import {ZodError} from "zod";

jest.mock('../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('register function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should can successfully register', async () => {
        // mock the dependencies
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (User.prototype.save as jest.Mock).mockResolvedValue(MockData.USER);

        // register request
        const registerRequest = MockData.REGISTER;

        // call the register method
        const result = await UserService.register(registerRequest);

        expect(User.findOne).toHaveBeenCalledTimes(2); // check email and nik
        expect(bcrypt.hash).toHaveBeenCalledWith(registerRequest.password, 10);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(result).toMatchObject({
            _id: expect.any(String),
            nik: registerRequest.nik,
            name: registerRequest.name,
            email: registerRequest.email,
            role: 'user',
            is_verified: true,
        });
    });

    it('should throw an error if user already exists', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(MockData.USER);

        const registerRequest = MockData.REGISTER;

        await expect(UserService.register(registerRequest)).rejects.toThrow(CustomErrors);
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the required field is invalid value', async () => {
        const registerRequest = MockData.REGISTER;
        registerRequest.nik = '12345678'; // 16 digits should be

        await expect(UserService.register(registerRequest)).rejects.toThrow(ZodError);
    });
});

describe('login function', () => {
    it('should can login successfully', async () => {
        const req = MockData.LOGIN;
        const user = MockData.USER;

        (User.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('mocked.jwt.token');

        const result = await UserService.login(req);

        expect(User.findOne).toHaveBeenCalledWith({email: req.email});
        expect(bcrypt.compare).toHaveBeenCalledWith(req.password, user.password);
        expect(jwt.sign).toHaveBeenCalledWith({
            id: user._id, role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        expect(result).toMatchObject({
            _id: user._id,
            nik: user.nik,
            name: user.name,
            email: user.email,
            role: user.role,
            is_verified: user.is_verified,
            token: 'mocked.jwt.token'
        });
    });

    it('should throw an error if user does not exist', async () => {
        const req = MockData.LOGIN;

        (User.findOne as jest.Mock).mockResolvedValue(null);

        await expect(UserService.login(req)).rejects.toThrowError(CustomErrors);
        expect(User.findOne).toHaveBeenCalledWith({email: req.email});
    });

    it('should throw an error if incorrect password', async () => {
        const req = MockData.LOGIN;
        const user = MockData.USER;

        (User.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(UserService.login(req)).rejects.toThrowError(CustomErrors);
        expect(User.findOne).toHaveBeenCalledWith({email: req.email});
        expect(bcrypt.compare).toHaveBeenCalledWith(req.password, user.password);
    });
});
