type APIResponse = {
    code: number;
    status: string;
    message: string;
    data: any;
}

export function toAPIResponse(code: number, status: string, data: any, message: string): APIResponse {
    return {
        code: code,
        status: status,
        message: message,
        data: data
    }
}