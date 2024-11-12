import { Request, Response, NextFunction } from 'express';
import {LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserSessionData} from "../formatters/user-formatter";
import {UserService} from "../services/user-service";
import {toAPIResponse} from "../formatters/api-response";
import {CustomRequest} from "../types/custom-request";
import session from 'express-session';

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

    static async logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            req.session.destroy((err) => {
                if (err) next(err);
            });
        
            res.status(200).json(
                toAPIResponse(200, "OK", { is_logged_out: true }, "You're logged out")
            );
        } catch (err) {
            next(err);
        }
    }

    static async update(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.body as UpdateUserRequest;
            const userId = (req.session.user as UserSessionData)._id;
            const file = req.file;

            // Memanggil fungsi service
            const user = await UserService.update(file, request, userId);
            res.status(200).json(
                toAPIResponse(200, "OK", user, "User successfully updated")
            );

        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.session.user as UserSessionData)._id;

            const user = await UserService.getById(userId);
            res.status(200).json(
                toAPIResponse(200, "OK", user, "User found")
            );

        } catch (error) {
            next(error);
        }
    }
    
    static async getAll(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string || '0', 10);
            const limit = parseInt(req.query.limit as string || '0', 10);

            const sessionData = (req.session.user as UserSessionData);
            const users = await UserService.getAllUsers(sessionData, page, limit);

            res.status(200).json({
                code: 200,
                status: 'OK',
                message: 'Users retrieved',
                data: users.users,
                meta: {
                    total: users.total,
                    page,
                    entries: limit,
                }
            });            
        } catch (error) {
            next(error);
        }
    }

    static async verifyAccount(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const sessionData = (req.session.user as UserSessionData);

            const user = await UserService.verifyUser(userId, sessionData);
            res.status(200).json(
                toAPIResponse(200, 'OK', user, 'Account verified successfully')
            );
        } catch (error) {
            next(error);
        }
    }

    static async getComplaintsByUserId(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const complaints = await UserService.getComplaintsByUserId(userId);

            res.status(200).json(
                toAPIResponse(200, 'OK', complaints, `Complaints found: ${complaints.complaints.length}`)
            );
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const sessionData = req.session.user as UserSessionData;
            const deletedUser = await UserService.delete(userId, sessionData);

            res.status(200).json(
                toAPIResponse(200, 'OK', deletedUser, 'User deleted successfully')
            );
        } catch (e) {
            next(e);
        }
    }
}
