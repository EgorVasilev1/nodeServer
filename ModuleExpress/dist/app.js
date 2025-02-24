"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const winston_loki_1 = __importDefault(require("winston-loki"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const prom_client_1 = __importDefault(require("prom-client"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const errors_js_1 = require("./config/errors.js");
const success_js_1 = require("./config/success.js");
dotenv_1.default.config();
class App {
    app;
    logger;
    LOG_DIR;
    PORT;
    routes;
    dbPool;
    redisClient;
    constructor(routes, dbPool, redisClient) {
        this.app = (0, express_1.default)();
        this.PORT = process.env.PORT || '8083';
        this.LOG_DIR = path_1.default.join(__dirname, "logs");
        this.routes = routes;
        this.dbPool = dbPool;
        this.redisClient = redisClient;
        this.initCors();
        this.initLogger();
        this.initRoutes();
        this.initErrorHandling();
    }
    initCors() {
        const corsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            optionsSuccessStatus: 200
        };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initLogger() {
        if (!fs_1.default.existsSync(this.LOG_DIR)) {
            fs_1.default.mkdirSync(this.LOG_DIR);
        }
        this.logger = winston_1.default.createLogger({
            level: "debug",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
                }),
                new winston_1.default.transports.File({ filename: path_1.default.join(this.LOG_DIR, "app.log") }),
                new winston_loki_1.default({
                    host: "http://localhost:3100", // Loki хост
                    labels: { app: "express-app" },
                    json: true,
                    format: winston_1.default.format.json(),
                }),
            ],
        });
        const logStream = fs_1.default.createWriteStream(path_1.default.join(this.LOG_DIR, "requests.log"), { flags: "a" });
        this.app.use((0, morgan_1.default)("combined", { stream: logStream }));
        this.app.use((0, morgan_1.default)("dev", {
            stream: {
                write: (message) => this.logger.info(message.trim()),
            },
        }));
        this.app.use((req, res, next) => {
            this.logger.info({
                message: "HTTP Request",
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
            });
            next();
        });
    }
    initRoutes() {
        this.app.use('/api', this.routes.getRouter());
        this.app.get("/metrics", async (req, res) => {
            res.set("Content-Type", prom_client_1.default.register.contentType);
            res.end(await prom_client_1.default.register.metrics());
            new success_js_1.Success(await prom_client_1.default.register.metrics(), 200);
        });
        this.app.get("/endpoints", (req, res) => {
            const endpoints = (0, express_list_endpoints_1.default)(this.app);
            res.json(endpoints);
        });
    }
    initErrorHandling() {
        this.app.use((err, req, res, next) => {
            this.logger.error({
                message: "Unhandled Error",
                error: err.stack,
                method: req.method,
                url: req.url,
            });
            new errors_js_1.Errors(err.message, 500);
        });
    }
    start() {
        this.dbPool
            .connect()
            .then(() => {
            this.app.listen(this.PORT, () => {
                this.logger.info(`Сервер запущен на http://localhost:${this.PORT}`);
            });
        })
            .then(() => {
            this.logger.info("Подключение к базе данных установлено");
        })
            .then(() => {
            this.dbPool.initializeTables();
            this.logger.info("База данных успешно инициализирована");
        })
            .then(() => {
            this.redisClient.connect();
            this.logger.info("Redis подключён");
        })
            .catch((err) => {
            this.logger.error("Ошибка подключения к базе данных:", err);
        });
    }
}
exports.App = App;
