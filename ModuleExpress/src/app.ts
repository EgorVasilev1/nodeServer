import express, { Application, Request, Response, NextFunction } from "express";
import fs from "fs";
import morgan from "morgan";
import winston from "winston";
import LokiTransport from "winston-loki";
import listEndpoints from "express-list-endpoints";
import promClient from "prom-client";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { RedisClient } from "./config/redis.js";
import { Routes } from "./routes/routes.js";
import { DatabasePool } from "./config/db.js";
import { Errors } from "./config/errors.js";
import { Success } from "./config/success.js";

dotenv.config();

export class App {
  public app: Application;
  private logger!: winston.Logger;
  private LOG_DIR: string;
  private PORT: string;
  private routes: Routes;
  private dbPool: DatabasePool;
  private redisClient: RedisClient;

  constructor(routes: Routes, dbPool: DatabasePool, redisClient: RedisClient) {
    this.app = express();
    this.PORT = process.env.PORT || '8083';
    this.LOG_DIR = path.join(__dirname, "logs");
    this.routes = routes;
    this.dbPool = dbPool;
    this.redisClient = redisClient;

    this.initCors();
    this.initLogger();
    this.initRoutes();
    this.initErrorHandling();
  }

  private initCors() {
    const corsOptions = {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }


  private initLogger() {
    if (!fs.existsSync(this.LOG_DIR)) {
      fs.mkdirSync(this.LOG_DIR);
    }

    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({ filename: path.join(this.LOG_DIR, "app.log") }),
        new LokiTransport({
          host: "http://localhost:3100", // Loki хост
          labels: { app: "express-app" },
          json: true,
          format: winston.format.json(),
        }),
      ],
    });

    const logStream = fs.createWriteStream(path.join(this.LOG_DIR, "requests.log"), { flags: "a" });

    this.app.use(morgan("combined", { stream: logStream }));
    this.app.use(
      morgan("dev", {
        stream: {
          write: (message) => this.logger.info(message.trim()),
        },
      })
    );

    this.app.use((req: Request, res: Response, next: NextFunction) => {
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

  private initRoutes() {
    this.app.use('/api', this.routes.getRouter());
    this.app.get("/metrics", async (req: Request, res: Response) => {
      res.set("Content-Type", promClient.register.contentType);
      res.end(await promClient.register.metrics());
      new Success(await promClient.register.metrics(), 200);
    });

    this.app.get("/endpoints", (req: Request, res: Response) => {
      const endpoints = listEndpoints(this.app);
      res.json(endpoints);
    });
  }

  private initErrorHandling() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.logger.error({
        message: "Unhandled Error",
        error: err.stack,
        method: req.method,
        url: req.url,
      });
      new Errors(err.message, 500)
    });    
  }

  public start() {
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

