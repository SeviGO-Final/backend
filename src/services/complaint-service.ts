import {
    CreateOrUpdateComplaint,
    toComplaintResponse, toTrackingStatusResponses
} from "../formatters/complaint-formatter";
import path from "path";
import fs from "fs";
import {Validation} from "../validations/schema";
import {Complaint, IComplaint} from "../models/Complaint";
import {ComplaintValidation} from "../validations/complaint-validation";
import {CustomErrors} from "../types/custom-errors";
import {TrackingStatus} from "../models/TrackingStatus";
import {ServiceUtils} from "../utils/service-utils";
import { Category } from "../models/Category";
import {AdminFeedback} from "../models/AdminFeedback";

export class ComplaintService {
    static async create(file: Express.Multer.File | undefined, request: CreateOrUpdateComplaint, userId: string) {
        // validate json request body
        const saveRequest = Validation.validate(ComplaintValidation.CREATE, request);

        // generate slug to avoid idempotent request
        saveRequest.slug = ServiceUtils.slugGenerate(saveRequest.title, userId);
        const isDuplicateComplaint = await Complaint.findOne({ slug: saveRequest.slug });
        if (isDuplicateComplaint) {
            throw new CustomErrors(409, 'Conflict', 'Your same complaint have been created before');
        }

        // if no file
        if (!file) {
            throw new CustomErrors(400, 'Bad Request', 'Evidence of complaint is required');
        }

        // set file size limits
        if (file.size > ServiceUtils.MAX_SIZE) {
            throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
        }

        // Save file to disk
        const uploadDir = path.join(__dirname, '../../uploads/complaints');
        const filePath = path.join(__dirname, '../../uploads/complaints', `${Date.now()}-${file.originalname}`);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        try {
            // Write file
            fs.writeFileSync(filePath, file.buffer);

            // Save file url
            saveRequest.evidence = `uploads/complaints/${path.basename(filePath)}`
            saveRequest.current_status = 'Submitted';
            saveRequest.user = userId;

            // save to complaint
            const complaint = await new Complaint(saveRequest)
                .save();

            // save current_status to tracking status too
            await new TrackingStatus({
                status: saveRequest.current_status,
                complaint: complaint._id,
            }).save();

            return toComplaintResponse(complaint);
        } catch (e) {
            // delete file if an error occurred
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error(`Failed to handle file evidence: ${(e as Error).message}`);
        }
    }

    static async getById(complaintId: string) {
        const complaint = await ServiceUtils.isExistsComplaint(complaintId);        
        const category = await Category.findById(complaint.category).select('_id name');

        const trackingStatus = await TrackingStatus.find({
            complaint: complaintId
        }).sort({ updatedAt: -1 }); // sort by latest update

        const response = toComplaintResponse(complaint);
        response.category = category;
        response.tracking_status = toTrackingStatusResponses(trackingStatus);

        return response;
    }

    static async getAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const complaints = await Complaint.find()
            .populate('category', '_id name')
            .populate('admin_feedback', '_id')
            .sort({ updated_at: -1 })
            .skip(skip)
            .limit(limit);

        console.log(complaints);
        const totalComplaints = await Complaint.countDocuments();        
        return {
            total: totalComplaints,
            complaints: complaints.map(toComplaintResponse),
        }
    }

    static async update(complaintId: string, file: Express.Multer.File | undefined, request: CreateOrUpdateComplaint, userId: string) {
        const oldComplaint = await ServiceUtils.isExistsComplaint(complaintId);
        if (oldComplaint.user.toString() !== userId) {
            throw new CustomErrors(403, 'Forbidden', 'You are not the owner of this complaint');
        }

        // validate the request body
        const validRequest = Validation.validate(ComplaintValidation.UPDATE, request);
        const { title, content, date_event, location, evidence } = validRequest;

        const updateData: Partial<IComplaint> = {};
        if (title) {
            const slug = ServiceUtils.slugGenerate(title, userId);
            const isDuplicateSlug = await Complaint.findOne({ slug: slug }).populate('_id');
            if (isDuplicateSlug) {
                throw new CustomErrors(409, 'Conflict', 'Complaint with same title already exists');
            }
            updateData.title = title;
        }
        if (content) updateData.content = content;
        if (date_event) updateData.date_event = date_event;
        if (location) updateData.location = location;
        if (evidence) {
            if (file!.size > ServiceUtils.MAX_SIZE) {
                throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
            }
        }
        // Save file to disk
        const filePath = path.join(__dirname, '../../uploads/complaints', `${Date.now()}-${file!.originalname}`);
        try {
            // Write file
            fs.writeFileSync(filePath, file!.buffer);
            fs.unlinkSync(path.join(__dirname, '../../', oldComplaint.evidence));

            // Save file url
            updateData.evidence = `uploads/complaints/${path.basename(filePath)}`;

            // save updated complaint
            const updatedComplaint = await Complaint.findByIdAndUpdate(
                complaintId,
                { $set: updateData },
                { new: true }
            );
            return toComplaintResponse(updatedComplaint!);
        } catch (e) {
            // delete file if an error occurred
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new Error(`Failed to handle file upload: ${(e as Error).message}`);
        }
    }

    static async deleteOneHistory(complaintId: string, userId: string, userRole: string) {
        const complaint = await ServiceUtils.isExistsComplaint(complaintId);
        if (userRole !== 'admin') {
            throw new CustomErrors(403, 'Forbidden', 'Only admin can perform this action');
        }

        await Complaint.updateOne({ _id: complaintId }, { is_deleted: true });
        return {
            complaint_id: complaintId,
            deleted_from_history: true,
        };
    }

    static async deleteAllHistories(userId: string, userRole: string) {
        if (userRole !== 'admin') {
            throw new CustomErrors(403, 'Forbidden', 'Only admin can perform this action');
        }
        await Complaint.updateMany({ user: userId }, { is_deleted: true });
        return {
            histories_deleted: true,
        };
    }

    static async delete(complaintId: string, userId: string, userRole: string) {
        const complaint = await ServiceUtils.isExistsComplaint(complaintId);
        if (userRole !== 'admin') {
            throw new CustomErrors(403, 'Forbidden', 'Only admin can perform this action');
        }

        await Complaint.deleteOne({ _id: complaintId });

        // delete file evidence in server
        const filePath = path.join(__dirname, '../../', complaint.evidence);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return {
            complaint_id: complaintId,
            slug: complaint.slug,
            is_deleted: true
        };
    }
}