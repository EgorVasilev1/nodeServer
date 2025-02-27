import { Response } from 'express';

export class Success {
    constructor(
        private message: string, 
        private statusCode: number = 200
    ) {}

    send(res: Response, data?: Record<string, any> | any[] | string) { // Чётко указываем тип данных
        const response: { message: string; data?: unknown } = { message: this.message };
        
        if (data) {
            // Преобразуем данные, если они пришли из ORM
            response.data = this.sanitizeData(data);
        }

        return res.status(this.statusCode).json(response);
    }

    private sanitizeData(data: any): any {
        // Если данные из Mongoose, преобразуем в чистый объект
        if (data && typeof data === 'object' && 'lean' in data) {
            return data.lean();
        }
        return data;
    }
}
