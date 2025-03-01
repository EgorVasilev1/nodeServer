export class NotFoundError extends Error {
    public statusCode: number;

    constructor(message = "Ресурс не найден", statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
