import { Category, ICategory } from "../models/Category";
import {UserSessionData} from "../formatters/user-formatter";
import {ServiceUtils} from "../utils/service-utils";
export class CategoryService {

  async createCategory(name: string, sessionData: UserSessionData): Promise<ICategory> {
    ServiceUtils.onlyAdminCan(sessionData, 'This action is restricted to administrators only.');
    const category = new Category({ name });
    return await category.save();
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async updateCategory(id: string, name: string, sessionData: UserSessionData): Promise<ICategory | null> {
    ServiceUtils.onlyAdminCan(sessionData, 'This action is restricted to administrators only.');
    return await Category.findByIdAndUpdate(id, { name }, { new: true });
  }

  async deleteCategory(id: string, sessionData: UserSessionData): Promise<ICategory | null> {
    ServiceUtils.onlyAdminCan(sessionData, 'This action is restricted to administrators only.');
    return await Category.findByIdAndDelete(id);
  }
}

export const categoryService = new CategoryService();
