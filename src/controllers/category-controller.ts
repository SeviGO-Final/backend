import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category-service";
import { createCategorySchema } from "../validations/category-validation";
import { toAPIResponse } from "../formatters/api-response";
import {CustomRequest} from "../types/custom-request";
import { Category } from "../models/Category";

export class CategoryController {
  async createCategory(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = createCategorySchema.parse(req.body);
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        res.status(400).json(
          toAPIResponse(400, "Bad Request", null, "name must be unique")
        );
        return;
      }
  
      const newCategory = await categoryService.createCategory(name);
      res.status(201).json(
        toAPIResponse(201, "Created", newCategory, "Category created successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(
        toAPIResponse(200, "Success", categories, "Categories retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json(
          toAPIResponse(404, "Not Found", null, "Category not found")
        );
        return;
      }
      res.status(200).json(
        toAPIResponse(200, "Success", category, "Category retrieved successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = createCategorySchema.parse(req.body);
      const updatedCategory = await categoryService.updateCategory(id, name);
      if (!updatedCategory) {
        res.status(404).json(
          toAPIResponse(404, "Not Found", null, "Category not found")
        );
        return;
      }
      res.status(200).json(
        toAPIResponse(200, "Success", updatedCategory, "Category updated successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deletedCategory = await categoryService.deleteCategory(id);
      if (!deletedCategory) {
        res.status(404).json(
          toAPIResponse(404, "Not Found", null, "Category not found")
        );
        return;
      }
      res.status(200).json(
        toAPIResponse(200, "Success", null, "Category successfully deleted")
      );
    } catch (error) {
      next(error); 
    }
  }
}

export const categoryController = new CategoryController();
