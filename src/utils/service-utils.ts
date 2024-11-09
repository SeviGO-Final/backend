import {Types} from "mongoose";
import {CustomErrors} from "../types/custom-errors";
import {Complaint} from "../models/Complaint";
import slugify from "slugify";
import {UserSessionData} from "../formatters/user-formatter";

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