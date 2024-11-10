import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category-service";
import { createCategorySchema } from "../validations/category-validation";
import { toAPIResponse } from "../formatters/api-response";
import {UserSessionData} from "../formatters/user-formatter";
import {CustomRequest} from "../types/custom-request";

export class CategoryController {
  async createCategory(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionData = (req.session.user as UserSessionData);
      const { name } = createCategorySchema.parse(req.body);
      const newCategory = await categoryService.createCategory(name, sessionData);
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
      const sessionData = (req.session.user as UserSessionData);
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
      const sessionData = (req.session.user as UserSessionData);
      const { id } = req.params;
      const { name } = createCategorySchema.parse(req.body);
      const updatedCategory = await categoryService.updateCategory(id, name, sessionData);
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
      const sessionData = (req.session.user as UserSessionData);
      const { id } = req.params;
      const deletedCategory = await categoryService.deleteCategory(id, sessionData);
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
