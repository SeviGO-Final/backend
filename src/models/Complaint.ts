import {Schema, model, Document, Types} from "mongoose";

export interface IComplaint extends Document{
    _id: Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    date_event: Date;
    location: string;
    evidence: string;
    current_status: string;
    user: Types.ObjectId; // reference to users
    category: Types.ObjectId; // reference to categories
    admin_feedback: Types.ObjectId;
    is_deleted: boolean;
    created_at?: Date,
    updated_at?: Date
}

const complaintSchema = new Schema<IComplaint>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true},
    content: { type: String, required: true },
    date_event: { type: Date, required: true },
    location: { type: String, required: true },
    evidence: { type: String, required: true },
    current_status: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // relation to User
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // relation to Category
    admin_feedback: { type: Schema.Types.ObjectId, ref: 'AdminFeedback', default: null }, // relation to AdminFeedback
    is_deleted: { type: Boolean, required: false, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }});

export const Complaint = model<IComplaint>('Complaint', complaintSchema);