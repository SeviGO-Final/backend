import { NextFunction, Request, Response } from "express";
import { StatisticsService } from "../services/statistics-service";
import { toAPIResponse } from "../formatters/api-response";

export class StatisticsController {
    static async categoryPercentages(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryPercentages = await StatisticsService.categoryPercentages();
            res.status(200).json(toAPIResponse(200, 'OK', categoryPercentages, 'Percentage of complaints per category'));
        } catch(err) {
            next(err);
        }
    }

    static async totalUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const totalUsers = await StatisticsService.totalUsers();
            res.status(200).json(toAPIResponse(200, 'OK', totalUsers, 'Total users registered'));
        } catch(err) {
            next(err);
        }
    }

    static async totalComplaints(req: Request, res: Response, next: NextFunction) {
        try {
            const totalComplaint = await StatisticsService.totalComplaints();
            res.status(200).json(toAPIResponse(200, 'OK', totalComplaint, 'Total complaints submitted'));
        } catch(err) {
            next(err);
        }
    }

    static async totalComplaintsHasAccepted(req: Request, res: Response, next: NextFunction) {
        try {
            const totalComplaintHasAccepted = await StatisticsService.totalComplaintHasAccepted();
            res.status(200).json(toAPIResponse(200, 'OK', totalComplaintHasAccepted, 'Total complaint has been accepted'));
        } catch(err) {
            next(err);
        }
    }

    static async totalComplaintsHasRejected(req: Request, res: Response, next: NextFunction) {
        try {
            const totalComplaintHasRejected = await StatisticsService.totalComplaintHasRejected();
            res.status(200).json(toAPIResponse(200, 'OK', totalComplaintHasRejected, 'Total complaint has been rejected'));
        } catch(err) {
            next(err);
        }
    }

    static async totalComplaintsInProcessing(req: Request, res: Response, next: NextFunction) {
        try {
            const totalComplaintInProcessing = await StatisticsService.totalComplaintInProcessing();
            res.status(200).json(toAPIResponse(200, 'OK', totalComplaintInProcessing, 'Total complaint is in process'));
        } catch(err) {
            next(err);
        }
    }
}