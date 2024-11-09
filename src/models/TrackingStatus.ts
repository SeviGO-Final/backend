import {Schema, model, Document, Types} from "mongoose";

export interface ITrackingStatus extends Document {
    _id: Types.ObjectId;
    status: string;
    notes: string;
    complaint: Types.ObjectId; // reference to complaints
    admin?: Types.ObjectId // reference to users (admin role)
}

const trackingStatusSchema = new Schema<ITrackingStatus>({
    status: { type: String, required: true },
    notes: { type: String, required: false },
    complaint: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, {
    timestamps: true }
);

export const TrackingStatus = model<ITrackingStatus>('TrackingStatus', trackingStatusSchema);