import {IComplaint} from "../models/Complaint";
import {ITrackingStatus} from "../models/TrackingStatus";

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

export type TrackingStatusResponse = {
    _id: string;
    status: string;
    notes: string;
    updated_at?: string;
}

export type ComplaintResponse = {
    _id: string;
    title: string;
    content: string;
    date_event: string;
    location: string;
    evidence: string;
    current_status: string;
    category: any;
    admin_feedback?: string;
    tracking_status?: TrackingStatusResponse[];
    is_deleted: boolean;
    created_at?: string,
    updated_at?: string
}

export function toTrackingStatusResponse(trackingStatus: any): TrackingStatusResponse {
    return {
        _id: trackingStatus._id.toString(),
        status: trackingStatus.status,
        notes: trackingStatus.notes,
        updated_at: trackingStatus.updatedAt?.toLocaleString(),
    }
}

export function toTrackingStatusResponses(trackingStatuses: any): TrackingStatusResponse[] {
    const trackingStatusResponses: TrackingStatusResponse[] = [];
    for (const trackingStatus of trackingStatuses) {
        trackingStatusResponses.push(toTrackingStatusResponse(trackingStatus));
    }
    return trackingStatusResponses;
}

export function toComplaintResponse(complaint: any): ComplaintResponse {
    return {
        _id: complaint._id.toString(),
        title: complaint.title,
        content: complaint.content,
        date_event: complaint.date_event.toLocaleString(),
        location: complaint.location,
        evidence: complaint.evidence,
        admin_feedback: complaint.admin_feedback?._id,
        current_status: complaint.current_status,
        category: complaint.category,
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