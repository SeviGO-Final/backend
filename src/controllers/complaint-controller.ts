import { CustomRequest } from "../types/custom-request";
import { Response, NextFunction } from "express";
import {UserSessionData} from "../formatters/user-formatter";
import {CreateOrUpdateComplaint} from "../formatters/complaint-formatter";
import {ComplaintService} from "../services/complaint-service";
import {toAPIResponse} from "../formatters/api-response";

export class ComplaintController {
    static async create(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const file = req.file;

            const request = req.body as CreateOrUpdateComplaint;
            request.date_event = new Date(req.body.date_event);

            const complaint = await ComplaintService.create(file, request, userId);
            res.status(201).json(
                toAPIResponse(201, 'Created', complaint, 'Complaint successfully created')
            );
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const complaintId = req.params.id;
            const complaint = await ComplaintService.getById(complaintId);
            res.status(200).json(
                toAPIResponse(200, 'OK', complaint, 'Complaint found')
            );
        } catch (e) {
            next(e);
        }
    }

    static async update(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const file = req.file;
            const request = req.body as CreateOrUpdateComplaint;
            request.date_event = new Date(req.body.date_event);
            const complaintId = req.params.id;

            const complaint = await ComplaintService.update(complaintId, file, request, userId);
            res.status(200).json(
                toAPIResponse(200, 'OK', complaint, 'Complaint updated')
            );
        } catch (e) {
            next(e);
        }
    }

    static async deleteHistories(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const complaintId = req.params.id;
            await ComplaintService.deleteHistories(complaintId, userId);
            res.status(200).json(
                toAPIResponse(200, 'OK', null, "Complaint's histories deleted")
            );
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const complaintId = req.params.id;
            await ComplaintService.delete(complaintId, userId);
            res.status(200).json(
                toAPIResponse(200, 'OK', null, 'Complaint deleted')
            );
        } catch (e) {
            next(e);
        }
    }
}