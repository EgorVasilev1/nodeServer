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
        return res.status(this.statusCode).json({ message: this.message, data });
    }
}
exports.Success = Success;
