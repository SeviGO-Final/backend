import express from 'express';
import {UserController} from "../controllers/user-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/complaints', authMiddleware, UserController.getComplaintsByUserId);
router.patch('/verify/:id', authMiddleware, UserController.verifyAccount);

export default router;
