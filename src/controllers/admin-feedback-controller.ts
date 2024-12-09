import { Response,  NextFunction } from "express";
import {CustomRequest} from "../types/custom-request";
import {AdminFeedbackService} from "../services/admin-feedback-service";
import {CreateAdminFeedback} from "../formatters/admin-feedback-formatter";
import {UserSessionData} from "../formatters/user-formatter";
import {toAPIResponse} from "../formatters/api-response";

export class AdminFeedbackController {
    static async create(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const complaintId = req.params.complaintId;

            const request = req.body as CreateAdminFeedback;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.create(file, request, complaintId, sessionData);
            res.status(201).json(
                toAPIResponse(201, 'Created', adminFeedback, 'Admin feedback successfully created')
            );
        } catch (e) {
            next(e);
        }
    }

    static async ProcessingComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const complaintId = req.params.complaintId;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.ProcessingComplaint(complaintId, sessionData);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is in process')
            );
        } catch (e) {
            next(e);
        }
    }

    static async rejectComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const complaintId = req.params.complaintId;
            const sessionData = req.session.user as UserSessionData;
            const request = req.body as CreateAdminFeedback;
            console.log(request)


            const adminFeedback = await AdminFeedbackService.rejectComplaint(file, request, complaintId, sessionData);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is Rejected')
            );
        } catch (e) {
            next(e);
        }
    }

    static async getFeedback(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const feedbackId = req.params.id;
            
            const adminFeedback = await AdminFeedbackService.getFeedback(feedbackId);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Detail of admin feedback')
            );
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userSession = req.session.user as UserSessionData;
            const adminFeedbacks = await AdminFeedbackService.getAll(userSession);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedbacks, 'List all admin feedbacks')
            )
        } catch (e) {
            next(e);
        }
    }
}