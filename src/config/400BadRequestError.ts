export class BadRequestError extends Error {
    public statusCode: number;

    constructor(message = "Некорректный запрос", statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
