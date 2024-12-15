import { Router } from "express";
import { categoryController } from "../controllers/category-controller";

const router = Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);

export default router;
