import express, { Request, Response } from 'express';
import {UserController} from "../controllers/user-controller";

const router = express.Router();

router.post('/users/register', UserController.register);
router.post('/users/login', UserController.login);
router.put('/verify/:id', UserController.verifyAccount);

export default router;
