import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomErrors } from "../types/custom-errors";
import { validationErrorFormatter } from "../formatters/validation-formatter";

export async function ErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
    if (err instanceof ZodError) {
        res.status(422).json({
            code: 422,
            status: "Unprocessable Entity",
            errors: validationErrorFormatter(err)
        });
    } else if (err instanceof CustomErrors) {
        res.status(err.code).json({
            code: err.code,
            status: err.status,
            errors: err.message
        });
    } else if (err.code === 11000) { // Menangani error unik MongoDB
        const duplicatedField = Object.keys(err.keyValue)[0]; // Mengambil field penyebab error
        res.status(400).json({
            code: 400,
            status: "Bad Request",
            errors: `${duplicatedField} must be unique`
        });
    } else {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: "Internal Server Error",
            errors: err.message
        });
    }
}
