import { Category, ICategory } from "../models/Category";
export class CategoryService {

  async createCategory(name: string): Promise<ICategory> {
    const category = new Category({ name });
    return await category.save();
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async updateCategory(id: string, name: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, { name }, { new: true });
  }

}

export const categoryService = new CategoryService();
