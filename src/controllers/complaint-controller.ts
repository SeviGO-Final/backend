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

    static async getAll(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string || '0', 10);
            const limit = parseInt(req.query.limit as string || '0', 10);

            const complaints = await ComplaintService.getAll(page, limit);
            res.status(200).json({
                code: 200,
                status: 'OK',
                message: 'Complaints retrieved',
                data: complaints.complaints,
                meta: {
                    total: complaints.total,
                    page,
                    entries: limit,
                }
            });                                
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

    static async deleteAllHistories(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const userRole = (req.session.user as UserSessionData).role;
    
            // Periksa apakah pengguna adalah admin
            if (userRole !== 'admin') {
                return res.status(403).json(
                    toAPIResponse(403, 'Forbidden', null, 'Only admin can perform this action')
                );
            }
    
            const deleteHistory = await ComplaintService.deleteAllHistories(userId, userRole);
            res.status(200).json(
                toAPIResponse(200, 'OK', deleteHistory, "Complaint's histories deleted")
            );
        } catch (e) {
            next(e);
        }
    }

    static async deleteOneHistory(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const userRole = (req.session.user as UserSessionData).role;
            const complaintId = req.params.id;
            const deleteHistory = await ComplaintService.deleteOneHistory(complaintId, userId, userRole);
            if (userRole !== 'admin') {
                return res.status(403).json(
                    toAPIResponse(403, 'Forbidden', null, 'Only admin can perform this action')
                );
            }
    
            res.status(200).json(
                toAPIResponse(200, 'OK', deleteHistory, "Complaint's history deleted")
            );
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const userId = (req.session.user as UserSessionData)._id;
            const userRole = (req.session.user as UserSessionData).role;
            const complaintId = req.params.id;
            const deletedComplaint = await ComplaintService.delete(complaintId, userId, userRole);
            if (userRole !== 'admin') {
                return res.status(403).json(
                    toAPIResponse(403, 'Forbidden', null, 'Only admin can perform this action')
                );
            }
            res.status(200).json(
                toAPIResponse(200, 'OK', deletedComplaint, 'Complaint deleted')
            );
        } catch (e) {
            next(e);
        }
    }
}