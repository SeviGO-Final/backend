import {IAdminFeedback} from "../models/AdminFeedback";

export type CreateAdminFeedback = {
    title: string;
    description: string;
    date: string;
    complaint?: string;
    attachment?: string;
}

export type ProcessOrRejectComplaint = {
    complaint: string;
}

type AdminFeedbackResponse = {
    _id: string
    title: string;
    description: string;
    date: string;
    attachment?: string
    complaint?: string;
    created_at?: string;
    updated_at?: string;
}

export function toAdminFeedbackResponse(adminFeedback: IAdminFeedback): AdminFeedbackResponse  {
    return {
        _id: adminFeedback._id.toString(),
        title: adminFeedback.title,
        description: adminFeedback.description,
        date: adminFeedback.date.toLocaleString(),
        attachment: adminFeedback.attachment,
        complaint: adminFeedback.complaint.toString(),
        // @ts-ignore
        created_at: adminFeedback.createdAt?.toLocaleString(),
        // @ts-ignore
        updated_at: adminFeedback.updatedAt?.toLocaleString()
    }
}