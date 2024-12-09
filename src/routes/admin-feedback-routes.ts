import express from "express";
import multer from "multer";
import {authMiddleware} from "../middlewares/auth-middleware";
import {AdminFeedbackController} from "../controllers/admin-feedback-controller";

export const adminFeedbackRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

adminFeedbackRoutes.get('/:id', AdminFeedbackController.getFeedback);

adminFeedbackRoutes.use(authMiddleware);
adminFeedbackRoutes.get('/', AdminFeedbackController.getAll);
adminFeedbackRoutes.post('/:complaintId', upload.single('attachment'), AdminFeedbackController.create);
adminFeedbackRoutes.post('/:complaintId/process', AdminFeedbackController.ProcessingComplaint);
adminFeedbackRoutes.post('/:complaintId/reject',upload.single('attachment'), AdminFeedbackController.rejectComplaint);
