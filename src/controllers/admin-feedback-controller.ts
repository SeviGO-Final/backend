import { Response,  NextFunction } from "express";
import {CustomRequest} from "../types/custom-request";
import {AdminFeedbackService} from "../services/admin-feedback-service";
import {CreateAdminFeedback, ProcessOrRejectComplaint} from "../formatters/admin-feedback-formatter";
import {UserSessionData} from "../formatters/user-formatter";
import {toAPIResponse} from "../formatters/api-response";

export class AdminFeedbackController {
    static async create(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const request = req.body as CreateAdminFeedback;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.create(file, request, sessionData);
            res.status(201).json(
                toAPIResponse(201, 'Created', adminFeedback, 'Admin feedback successfully created')
            );
        } catch (e) {
            next(e);
        }
    }

    static async processingComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as ProcessOrRejectComplaint;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.processingComplaint(request, sessionData);
            res.status(201).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is in process')
            );
        } catch (e) {
            next(e);
        }
    }

    static async rejectComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body as ProcessOrRejectComplaint;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.rejectComplaint(request, sessionData);
            res.status(201).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is rejected')
            );
        } catch (e) {
            next(e);
        }
    }
}