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
            console.log('from controller: ', complaintId);

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

    static async processingComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const complaintId = req.params.complaintId;
            const sessionData = req.session.user as UserSessionData;

            const adminFeedback = await AdminFeedbackService.processingComplaint(complaintId, sessionData);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is in process')
            );
        } catch (e) {
            next(e);
        }
    }

    static async rejectComplaint(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const complaintId = req.params.complaintId;
            const sessionData = req.session.user as UserSessionData;
            const request = req.body as CreateAdminFeedback;


            const adminFeedback = await AdminFeedbackService.rejectComplaint(request, complaintId, sessionData);
            res.status(200).json(
                toAPIResponse(200, 'OK', adminFeedback, 'Complaint is rejected')
            );
        } catch (e) {
            next(e);
        }
    }
}