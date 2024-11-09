import {z} from "zod";

export class AdminFeedbackValidation {
    static CREATE = z.object({
        content: z.string().min(3),
        date: z.string(),
        complaint: z.string().min(24),
    });

    static PROCESSING_OR_REJECT = z.object({
        complaint: z.string().min(24),
    });
}