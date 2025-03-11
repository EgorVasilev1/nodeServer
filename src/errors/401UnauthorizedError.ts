export class UnauthorizedError extends Error {
    public statusCode: number;

    constructor(message = "Неавторизованный доступ", statusCode = 401) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
