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
import { DatabasePool } from "./config/db.js";
import { InternalServerError } from "./errors/500InternalServerError.js";
import { UserRoutes } from "./feature/users/index.js";
import { AuthRoutes } from "./feature/authTs/index.js";
import { RolesRoutes } from "./feature/roles/index.js";
import { UserRolesRoutes } from "./feature/userRoles/index.js";

dotenv.config();

const PORT = process.env.PORT || '8083';
const LOG_DIR = path.join(__dirname, "logs");
const app: Application = express();
const dbPool = new DatabasePool();
const redisClient = new RedisClient();

const initCors = () => {
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const initLogger = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }

  const logger = winston.createLogger({
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
      new winston.transports.File({ filename: path.join(LOG_DIR, "app.log") }),
      new LokiTransport({
        host: "http://localhost:3100",
        labels: { app: "express-app" },
        json: true,
        format: winston.format.json(),
      }),
    ],
  });

  const logStream = fs.createWriteStream(path.join(LOG_DIR, "requests.log"), { flags: "a" });

  app.use(morgan("combined", { stream: logStream }));
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info({
      message: "HTTP Request",
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    next();
  });
  return logger;
};

const initRoutes = (logger: winston.Logger) => {
  app.use('/auth', AuthRoutes);
  app.use('/roles', RolesRoutes);
  app.use('/user-management', UserRolesRoutes);
  app.use('/users', UserRoutes);
  
  app.get("/debug-routes", (req, res) => {
    res.json(app._router.stack.map(layer => layer.route?.path).filter(Boolean));
  });

  app.get("/metrics", async (req: Request, res: Response) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  app.get("/endpoints", (req: Request, res: Response) => {
    const endpoints = listEndpoints(app);
    res.json(endpoints);
  });
};


const initErrorHandling = (logger: winston.Logger) => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({
      message: "Unhandled Error",
      error: err.stack,
      method: req.method,
      url: req.url,
    });
    new InternalServerError();
  });    
};

const initializeApp = async () => {
  initCors();
  const logger = initLogger();
  initRoutes(logger);
  initErrorHandling(logger);

  try {
    await dbPool.connect();
    logger.info("Подключение к базе данных установлено");
    
    await dbPool.initializeTables();
    logger.info("База данных успешно инициализирована");

    await redisClient.connect();
    logger.info("Redis подключён");

    initRoutes(logger);
    
    initErrorHandling(logger);

    app.listen(PORT, () => {
      logger.info(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Ошибка при запуске приложения:", err);
    process.exit(1);
  }
};

initializeApp();