import {IComplaint} from "../models/Complaint";

export type CreateOrUpdateComplaint = {
    title: string;
    slug: string;
    content: string;
    date_event: Date;
    location: string;
    category: string;
    evidence?: string;
    current_status?: string;
    user?: string;
}

export type ComplaintResponse = {
    _id: string;
    title: string;
    content: string;
    date_event: string;
    location: string;
    evidence: string;
    current_status: string;
    tracking_status?: object;
    is_deleted: boolean;
    created_at?: string,
    updated_at?: string
}

export function toComplaintResponse(complaint: IComplaint): ComplaintResponse {
    return {
        _id: complaint._id.toString(),
        title: complaint.title,
        content: complaint.content,
        date_event: complaint.date_event.toLocaleString(),
        location: complaint.location,
        evidence: complaint.evidence,
        current_status: complaint.current_status,
        is_deleted: complaint.is_deleted,
        created_at: complaint.created_at!.toLocaleString(),
        updated_at: complaint.updated_at!.toLocaleString()
    }
}

export function toComplaintResponses(complaints: IComplaint[]): ComplaintResponse[] {
    const complaintResponses: ComplaintResponse[] = [];

    complaints.forEach((value, index) => {
        complaintResponses.push(toComplaintResponse(value));
    });

    return complaintResponses;
}