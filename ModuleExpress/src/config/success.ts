import { Response } from 'express';

export class Success {
    public message: string;
    public statusCode: number;

    constructor(message: string, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }

    send(res: Response, data: any) {
        return res.status(this.statusCode).json({ message: this.message, data });
    }
}
