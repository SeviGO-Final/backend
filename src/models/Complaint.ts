import {Schema, model, Document, Types} from "mongoose";

export interface IComplaint extends Document{
    _id: Types.ObjectId;
    title: string;
    content: string;
    date_event: Date;
    location: string;
    evidence: string;
    current_status: string;
    user: Types.ObjectId; // reference to users
    category: Types.ObjectId; // reference to categories
    is_deleted: boolean;
}

const complaintSchema = new Schema<IComplaint>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date_event: { type: Date, required: true },
    location: { type: String, required: true },
    evidence: { type: String, required: true },
    current_status: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // relation to User
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // relation to Category
    is_deleted: { type: Boolean, required: false },
}, { timestamps: true });

export const Complaint = model<IComplaint>('Complaint', complaintSchema);