import { Router } from "express";
import { categoryController } from "../controllers/category-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

const router = Router();

router.post("/", authMiddleware, categoryController.createCategory);
router.get("/", authMiddleware, categoryController.getAllCategories);
router.get("/:id", authMiddleware, categoryController.getCategoryById);
router.put("/:id", authMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

export default router;
