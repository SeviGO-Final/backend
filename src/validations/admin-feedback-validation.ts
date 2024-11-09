import {z} from "zod";

export class AdminFeedbackValidation {
    static CREATE = z.object({
        title: z.string().min(3),
        description: z.string().min(3),
        date: z.string(),
    });
}