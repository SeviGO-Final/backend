import {Types} from "mongoose";
import {CustomErrors} from "../types/custom-errors";
import {Complaint} from "../models/Complaint";
import slugify from "slugify";
import {UserSessionData} from "../formatters/user-formatter";
import {TrackingStatus} from "../models/TrackingStatus";

export class ServiceUtils {
    static MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    static isValidObjectId(objectId: string) {
        if (!Types.ObjectId.isValid(objectId)) {
            throw new CustomErrors(400, 'Bad Request', "Invalid mongodb object ID format");
        }
    }

    static async isExistsComplaint(complaintId: string) {
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            throw new CustomErrors(404, 'Not Found', 'Complaint not found')
        }

        return complaint;
    }

    static async isExistingFeedback(complaintId: string, currentStatus: string, message: string) {
        const trackingStatus = await TrackingStatus.findOne({ complaint: complaintId, status: currentStatus })
            .select('_id');
        if (trackingStatus) {
            throw new CustomErrors(409, 'Conflict', message);
        }
    }

    static onlyAdminCan(sessionData: UserSessionData, message: string) {
        if (sessionData.role !== 'admin') {
            throw new CustomErrors(403, 'Forbidden', message);
        }
    }

    static slugGenerate = (title: string, userId: string): string => {
        const slug = slugify(title, { lower: true });
        return `${slug}-${userId}`;
    }
}