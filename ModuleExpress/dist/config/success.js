"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Success = void 0;
class Success {
    message;
    statusCode;
    constructor(message, statusCode = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }
    send(res, data) {
        const response = { message: this.message };
        if (data) {
            // Преобразуем данные, если они пришли из ORM
            response.data = this.sanitizeData(data);
        }
        return res.status(this.statusCode).json(response);
    }
    sanitizeData(data) {
        // Если данные из Mongoose, преобразуем в чистый объект
        if (data && typeof data === 'object' && 'lean' in data) {
            return data.lean();
        }
        return data;
    }
}
exports.Success = Success;
