import { z } from "zod";

// Validasi category
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
