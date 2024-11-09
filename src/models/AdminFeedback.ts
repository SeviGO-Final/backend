import {Schema, model, Document, Types} from "mongoose";

export interface IAdminFeedback extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    date: Date;
    attachment?: string;
    complaint: Types.ObjectId // reference to complaints
}

const adminFeedbackSchema = new Schema<IAdminFeedback>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    attachment: { type: String, required: false },
    complaint: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true }
}, {timestamps: true});

export const AdminFeedback = model<IAdminFeedback>('AdminFeedback', adminFeedbackSchema);