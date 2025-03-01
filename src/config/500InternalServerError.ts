export class InternalServerError extends Error {
    public statusCode: number;

    constructor(message = "Внутренняя ошибка сервера", statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
