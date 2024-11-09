import express from "express";
import multer from "multer";
import {ComplaintController} from "../controllers/complaint-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

export const complaintRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

complaintRoutes.get('/:id', ComplaintController.getById);

complaintRoutes.use(authMiddleware);
complaintRoutes.post('/', upload.single('evidence'), ComplaintController.create);
complaintRoutes.delete('/histories/all', ComplaintController.deleteAllHistories); // delete all complaint's histories
complaintRoutes.patch('/:id', upload.single('evidence'), ComplaintController.update);
complaintRoutes.delete('/:id/histories', ComplaintController.deleteOneHistory); // delete one complaint's history
complaintRoutes.delete('/:id', ComplaintController.delete); // delete a complaint permanently in database
