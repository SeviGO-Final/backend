import {z, ZodType} from "zod";

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        nik: z.string()
            .min(16, { message: "NIK harus terdiri dari 16 karakter." })
            .max(16, { message: "NIK tidak boleh lebih dari 16 karakter." }),
        name: z.string()
            .min(3, { message: "Nama harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Nama tidak boleh lebih dari 255 karakter." }),
        email: z.string()
            .min(3, { message: "Email harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Email tidak boleh lebih dari 255 karakter." })
            .email({ message: "Format email tidak valid." }),
        password: z.string()
            .min(3, { message: "Password harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
    });

    static readonly LOGIN: ZodType = z.object({
        email: z.string()
            .min(3, { message: "Email harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Email tidak boleh lebih dari 255 karakter." })
            .email({ message: "Format email tidak valid." }),
        password: z.string()
            .min(3, { message: "Password harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string()
            .min(3, { message: "Nama harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Nama tidak boleh lebih dari 255 karakter." }),
        email: z.string()
            .min(3, { message: "Email harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Email tidak boleh lebih dari 255 karakter." })
            .email({ message: "Format email tidak valid." }),
        old_password: z.string()
            .min(3, { message: "Password harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
            .optional(),
        new_password: z.string()
            .min(3, { message: "Password harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
            .optional(),
        confirm_password: z.string()
            .min(3, { message: "Password harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
            .optional(),
        address: z.string()
            .min(3, { message: "Address harus terdiri dari minimal 3 karakter." })
            .max(255, { message: "Password tidak boleh lebih dari 255 karakter." })
            .optional()
    })
}