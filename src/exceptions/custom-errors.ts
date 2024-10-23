export class CustomErrors extends Error {
     code: number;
     status: string;

    constructor(code: number, status: string, message: string) {
        super(message);
        this.code = code;
        this.status = status;
    }
}