import express from 'express';
import {UserController} from "../controllers/user-controller";
import {authMiddleware} from "../middlewares/auth-middleware";
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// for user
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/logout', authMiddleware, UserController.logout);
router.put('/profile', authMiddleware, upload.single('avatar'), UserController.update);
router.get('/profile', authMiddleware, UserController.getProfile);
router.get('/complaints', authMiddleware, UserController.getComplaintsByUserId);

// for admin
router.get('/', authMiddleware, UserController.getAll);
router.delete('/:id', authMiddleware, UserController.delete);
router.patch('/verify/:id', authMiddleware, UserController.verifyAccount);

export default router;
