import {CreateOrUpdateComplaint, toComplaintResponse, toComplaintResponses} from "../formatters/complaint-formatter";
import path from "path";
import fs from "fs";
import {Validation} from "../validations/schema";
import {Complaint, IComplaint} from "../models/Complaint";
import {ComplaintValidation} from "../validations/complaint-validation";
import {CustomErrors} from "../types/custom-errors";
import {TrackingStatus} from "../models/TrackingStatus";
import {isExistsComplaint, MAX_SIZE, slugGenerate} from "../utils/complaint-service";

export class ComplaintService {
    static async create(file: Express.Multer.File | undefined, request: CreateOrUpdateComplaint, userId: string) {
        // validate json request body
        const saveRequest = Validation.validate(ComplaintValidation.CREATE, request);

        // generate slug to avoid idempotent request
        saveRequest.slug = slugGenerate(saveRequest.title, userId);
        const isDuplicateComplaint = await Complaint.findOne({ slug: saveRequest.slug });
        if (isDuplicateComplaint) {
            throw new CustomErrors(409, 'Conflict', 'Your same complaint have been created before');
        }

        // if no file
        if (!file) {
            throw new CustomErrors(400, 'Bad Request', 'Evidence of complaint is required');
        }

        // set file size limits
        if (file.size > MAX_SIZE) {
            throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
        }

        // Save file to disk
        const uploadDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(__dirname, '../../uploads', `${Date.now()}-${file.originalname}`);
        if (!fs.existsSync(uploadDir)) {
            await fs.mkdirSync(uploadDir, { recursive: true });
        }

        try {
            // Write file
            fs.writeFileSync(filePath, file.buffer);

            // Save file url
            saveRequest.evidence = `/uploads/${path.basename(filePath)}`
            saveRequest.current_status = 'Laporan diajukan';
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
            throw new Error(`Failed to handle file upload: ${(e as Error).message}`);
        }
    }

    static async getById(complaintId: string) {
        const complaint = await isExistsComplaint(complaintId);
        const trackingStatus = await TrackingStatus.find({ complaint: complaintId });

        const response = toComplaintResponse(complaint);
        response.tracking_status = trackingStatus;

        return response;
    }

    static async update(complaintId: string, file: Express.Multer.File | undefined, request: CreateOrUpdateComplaint, userId: string) {
        const oldComplaint = await isExistsComplaint(complaintId);
        if (oldComplaint.user.toString() !== userId) {
            throw new CustomErrors(403, 'Forbidden', 'You are not the owner of this complaint');
        }

        // validate the request body
        const validRequest = Validation.validate(ComplaintValidation.UPDATE, request);
        const { title, content, date_event, location, evidence } = validRequest;

        const updateData: Partial<IComplaint> = {};
        if (title) {
            const slug = slugGenerate(title, userId);
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
            if (file!.size > MAX_SIZE) {
                throw new CustomErrors(400, 'Bad Request', 'File size exceeds 2MB limit')
            }
        }
        // Save file to disk
        const filePath = path.join(__dirname, '../../uploads', `${Date.now()}-${file!.originalname}`);
        try {
            // Write file
            fs.writeFileSync(filePath, file!.buffer);
            fs.unlinkSync(path.join(__dirname, '../../', oldComplaint.evidence));

            // Save file url
            updateData.evidence = `/uploads/${path.basename(filePath)}`;

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

    static async deleteHistories(complaintId: string, userId: string) {
        const complaint = await isExistsComplaint(complaintId);
        if (complaint.user.toString() !== userId) {
            throw new CustomErrors(403, 'Forbidden', 'You are not the owner of this complaint');
        }

        await Complaint.updateMany({ user: userId }, { is_deleted: true });
        return {
            histories_deleted: true,
        };
    }

    static async delete(complaintId: string, userId: string) {
        const complaint = await isExistsComplaint(complaintId);
        if (complaint.user.toString() !== userId) {
            throw new CustomErrors(403, 'Forbidden', 'You are not the owner of this complaint');
        }

        await Complaint.deleteOne({ _id: complaintId });
        return {
            complaint_id: complaintId,
            slug: complaint.slug,
            is_deleted: true
        };
    }
}