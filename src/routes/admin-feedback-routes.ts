import express from "express";
import multer from "multer";
import {authMiddleware} from "../middlewares/auth-middleware";
import {AdminFeedbackController} from "../controllers/admin-feedback-controller";

export const adminFeedbackRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

adminFeedbackRoutes.use(authMiddleware);
adminFeedbackRoutes.post('/:complaintId', upload.single('attachment'), AdminFeedbackController.create);
adminFeedbackRoutes.post('/:complaintId/process', AdminFeedbackController.processingComplaint);
adminFeedbackRoutes.post('/:complaintId/reject', AdminFeedbackController.rejectComplaint);
