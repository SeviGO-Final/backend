import {ZodError} from "zod";

export function validationErrorFormatter(zodError: ZodError) {
    const errorMessage: string[] = [];
    zodError.issues.forEach((value, index) => {
        const errorObject = zodError.issues[index];
        const field = errorObject.path.toString();
        const message = errorObject.message;

        errorMessage.push(`${field}: ${message}`);
    });

    return errorMessage;
}