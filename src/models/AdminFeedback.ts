import {Schema, model, Document, Types} from "mongoose";

export interface IAdminFeedback extends Document {
    _id: Types.ObjectId;
    content: string;
    date: Date;
    attachment: string;
    complaint: Types.ObjectId // reference to complaints
}

const adminFeedbackSchema = new Schema<IAdminFeedback>({
    content: { type: String, required: true },
    date: { type: Date, required: true },
    attachment: { type: String, required: true },
    complaint: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true }
}, {timestamps: true});

export const AdminFeedback = model<IAdminFeedback>('AdminFeedback', adminFeedbackSchema);