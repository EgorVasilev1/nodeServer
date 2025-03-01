export class ConflictError extends Error {
    public statusCode: number;

    constructor(message = "Конфликт данных", statusCode = 409) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
