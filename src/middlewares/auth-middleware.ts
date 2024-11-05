import { Response, NextFunction } from "express";
import {CustomErrors} from "../types/custom-errors";
import {getEnv} from "../utils/getenv";
import jwt from "jsonwebtoken";
import {CustomRequest} from "../types/custom-request";

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new CustomErrors(401, "Unauthorized", "Token not provided or invalid format"));
    }

    const token = authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, getEnv('JWT_SECRET'), (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return next(new CustomErrors(403, "Forbidden", "Token expired"));
                } else if (err.name === 'JsonWebTokenError') {
                    return next(new CustomErrors(403, "Forbidden", "Invalid token"));
                }
                return next(new CustomErrors(403, "Forbidden", "Token verification failed"));
            }
            req.session.user = decoded;
            next();
        });
    }
}