
export class ApiResponse {
    status: string;
    errorStatus: number;
    message: string | null;

    constructor(status: string, error: number, message: string = null) {
        this.status = status;
        this.errorStatus = error;
        this.message = message;
    }

}