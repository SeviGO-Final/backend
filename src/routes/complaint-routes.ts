import express from "express";
import multer from "multer";
import {ComplaintController} from "../controllers/complaint-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

export const complaintRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

complaintRoutes.get('/:id', ComplaintController.getById);
complaintRoutes.get('/', ComplaintController.getAll);

complaintRoutes.use(authMiddleware);
complaintRoutes.post('/', upload.single('evidence'), ComplaintController.create as express.RequestHandler);
complaintRoutes.delete('/histories/all', ComplaintController.deleteAllHistories as express.RequestHandler);
complaintRoutes.delete('/:id/histories', ComplaintController.deleteOneHistory as express.RequestHandler);
complaintRoutes.delete('/:id', ComplaintController.delete as express.RequestHandler);
complaintRoutes.patch('/:id', upload.single('evidence'), ComplaintController.update as express.RequestHandler);
// delete a complaint permanently in database
