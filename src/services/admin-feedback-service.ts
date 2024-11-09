import {Complaint} from "../models/Complaint";
import {ServiceUtils} from "../utils/service-utils";
import {toComplaintResponse} from "../formatters/complaint-formatter";
import {
    CreateAdminFeedback,
    ProcessOrRejectComplaint,
    toAdminFeedbackResponse
} from "../formatters/admin-feedback-formatter";
import {UserSessionData} from "../formatters/user-formatter";
import {CustomErrors} from "../types/custom-errors";
import path from "path";
import fs from "fs";
import {Validation} from "../validations/schema";
import {AdminFeedbackValidation} from "../validations/admin-feedback-validation";
import {AdminFeedback} from "../models/AdminFeedback";
import {TrackingStatus} from "../models/TrackingStatus";

export class AdminFeedbackService {
    static async create(file: Express.Multer.File | undefined, request: CreateAdminFeedback, sessionData: UserSessionData) {
        const validRequest = Validation.validate(AdminFeedbackValidation.CREATE, request);
        const complaintId = validRequest.complaint;

        ServiceUtils.onlyAdminCan(sessionData, "You're not an admin");
        ServiceUtils.isValidObjectId(complaintId);
        const complaint = await ServiceUtils.isExistsComplaint(complaintId);

        // if no file
        if (!file) {
            throw new CustomErrors(400, 'Bad Request', 'Attachment of feedback is required');
        }

        // set file size limits
        if (file.size > ServiceUtils.MAX_SIZE) {
            throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
        }

        // Save file to disk
        const uploadDir = path.join(__dirname, '../../uploads/feedback');
        const filePath = path.join(__dirname, '../../uploads/feedback', `${Date.now()}-${file.originalname}`);
        if (!fs.existsSync(uploadDir)) {
            await fs.mkdirSync(uploadDir, { recursive: true });
        }

        try {
            // save file
            fs.writeFileSync(filePath, file!.buffer);

            validRequest.attachment = `/uploads/feedback/${path.basename(filePath)}`;
            const adminFeedback = await new AdminFeedback(validRequest).save();

            // set complaint current_status is done!
            const currentStatus = 'Selesai diproses';
            complaint.current_status = currentStatus;
            await complaint.save();

            // save to tracking status
            await new TrackingStatus({
                status: currentStatus,
                complaint: complaintId,
                admin: sessionData._id
            }).save();

            return toAdminFeedbackResponse(adminFeedback);

        } catch (e) {
            // delete file if an error occurred
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error(`Failed to handle file attachment: ${(e as Error).message}`);
        }
    }

    static async processingComplaint(request: ProcessOrRejectComplaint, sessionData: UserSessionData) {
        const validRequest = Validation.validate(AdminFeedbackValidation.PROCESSING_OR_REJECT, request);
        const complaintId = validRequest.complaint;

        ServiceUtils.onlyAdminCan(sessionData, "You're not an admin");
        ServiceUtils.isValidObjectId(complaintId);

        const complaint = await ServiceUtils.isExistsComplaint(complaintId);

        // set complain current_status
        const currentStatus = 'Sedang diproses'
        complaint.current_status = currentStatus;
        await complaint.save();

        // save to tracking status
        await new TrackingStatus({
            status: currentStatus,
            complaint: complaintId,
            admin: sessionData._id
        }).save();

        return toComplaintResponse(complaint)
    }

    static async rejectComplaint(request: ProcessOrRejectComplaint, sessionData: UserSessionData) {
        const validRequest = Validation.validate(AdminFeedbackValidation.PROCESSING_OR_REJECT, request);
        const complaintId = validRequest.complaint;

        ServiceUtils.onlyAdminCan(sessionData, "You're not an admin");
        ServiceUtils.isValidObjectId(complaintId);

        const complaint = await ServiceUtils.isExistsComplaint(complaintId);

        // set complain current_status
        const currentStatus = 'Laporan ditolak';
        complaint.current_status = currentStatus;
        await complaint.save();

        // save to tracking status
        await new TrackingStatus({
            status: currentStatus,
            complaint: complaintId,
            admin: sessionData._id
        }).save();

        return toComplaintResponse(complaint)
    }
}