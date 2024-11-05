import { Request, Response, NextFunction } from 'express';
import {LoginUserRequest, RegisterUserRequest, UserJwtPayload} from "../formatters/user-formatter";
import {UserService} from "../services/user-service";
import {toAPIResponse} from "../formatters/api-response";
import {CustomRequest} from "../types/custom-request";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // parsing the request body to RegisterUserRequest format
            const request = req.body as RegisterUserRequest;

            // Memanggil fungsi service
            const user = await UserService.register(request)

            res.status(201).json(
                toAPIResponse(201, "Created", user, "User registered, pending admin verification")
            );

        } catch (error) {
            // pass to error middleware
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.body as LoginUserRequest;

            // Memanggil fungsi service
            const user = await UserService.login(request);
            res.status(200).json(
                toAPIResponse(200, "OK", user, "You're logged in")
            );

        } catch (error) {
            next(error);
        }
    }

    static async verifyAccount(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const adminId = (req.session.user as UserJwtPayload)._id;

            const user = await UserService.verifyUser(userId, adminId);
            res.status(200).json(toAPIResponse(200, 'OK', user, 'Account verified successfully'));
        } catch (error) {
            next(error);
        }
    }
}
