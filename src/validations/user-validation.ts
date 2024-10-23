import {z, ZodType} from "zod";

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        nik: z.string().min(16).max(16),
        name: z.string().min(1).max(255),
        email: z.string().min(1).max(255).email(),
        password: z.string().min(1).max(255),
    });

    static readonly LOGIN: ZodType = z.object({
        email: z.string().min(1).max(255).email(),
        password: z.string().min(1).max(255),
    });
}