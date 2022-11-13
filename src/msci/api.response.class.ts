
export class ApiResponse {
    status: string;
    error: number;
    message: string | null;

    constructor(status: string, error: number, message: string = null) {
        this.status = status;
        this.error = error;
        this.message = message;
    }

}