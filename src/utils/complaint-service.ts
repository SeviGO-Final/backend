import slugify from "slugify";
import {Complaint} from "../models/Complaint";
import {CustomErrors} from "../types/custom-errors";

export const slugGenerate = (title: string, userId: string): string => {
    const slug = slugify(title, { lower: true });
    return `${slug}-${userId}`;
}
export const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function isExistsComplaint(complaintId: string) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new CustomErrors(404, 'Not Found', 'Complaint not found')
    }

    return complaint;
}