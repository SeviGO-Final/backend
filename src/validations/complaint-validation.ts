import {z} from "zod";

export class ComplaintValidation{
    static CREATE = z.object({
        title: z.string().min(3),
        content: z.string().min(3),
        date_event: z.date(),
        location: z.string().min(3),
        category: z.string().min(3),
    });

    static UPDATE = z.object({
        title: z.string().min(3).optional(),
        content: z.string().min(3).optional(),
        date_event: z.date().optional(),
        location: z.string().min(3).optional(),
        category: z.string().min(3).optional(),
    });
}