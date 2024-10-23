import express, { Request, Response } from 'express';
import {AuthController} from "../controllers/auth-controller";

const router = express.Router();

router.post('/users', AuthController.register);
router.post('/users/login', AuthController.login);

export default router;
