import express from "express";
import multer from "multer";
import {ComplaintController} from "../controllers/complaint-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

export const complaintRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
complaintRoutes.get('/:id', ComplaintController.getById);

complaintRoutes.use(authMiddleware);
complaintRoutes.post('/', upload.single('evidence'), ComplaintController.create);
complaintRoutes.patch('/:id', upload.single('evidence'), ComplaintController.update);
complaintRoutes.get('/ntahlah', ComplaintController.getByUserId);
complaintRoutes.delete('/:id/histories', ComplaintController.deleteHistories); // delete all complaint's histories
complaintRoutes.delete('/:id', ComplaintController.delete); // delete a complaint permanently in database
