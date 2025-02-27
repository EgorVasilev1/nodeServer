import { Response } from 'express';

export class Errors extends Error {
    private statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    send(res: Response, message: string, statusCode: number): Response {
        return res.status(this.statusCode).json({
            error: this.message,
        });
    }
}
