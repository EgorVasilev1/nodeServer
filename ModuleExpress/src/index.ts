import { App } from "./app";
import { Routes } from "./routes/routes";
import { DatabasePool } from "./config/db";
import { AuthController } from "./featurse/authTs/authController";
import { RolesController } from "./featurse/roles/rolesController";
import { UsersController } from "./featurse/users/usersController";
import { AuthService } from "./featurse/authTs/authService";
import { RedisClient } from "./config/redis";
import { AuthModel } from "./featurse/authTs/authModel";
import { RolesService } from "./featurse/roles/rolesService";
import { UsersService } from "./featurse/users/usersService";
import { Middleware } from "./middleware/middleware";
import { UsersModel } from "./featurse/users/usersModel";
import { RolesModel } from "./featurse/roles/rolesModel";
import { ConnectorDBRoles } from "./featurse/roles/connector/connectDB";
import { ConnectorDBUsers } from "./featurse/users/connector/connectDB";
import { ConnectorRedisUsers } from "./featurse/users/connector/connectorRedis";
import { ConnectorRedisAuth } from "./featurse/authTs/connector/connectorRedis";


const dbPool = new DatabasePool();
const connectDBRoles = new ConnectorDBRoles(dbPool);
const connectorDBUsers = new ConnectorDBUsers(dbPool);
const usersModel = new UsersModel(connectorDBUsers);
const rolesModel = new RolesModel(connectDBRoles);
const redisClient = new RedisClient();
const connectorRedisUsers = new ConnectorRedisUsers(redisClient);
const connectorRedisAuth = new ConnectorRedisAuth(redisClient);
const authModel = new AuthModel(dbPool);
const authService = new AuthService(authModel, connectorRedisAuth);
const rolesService = new RolesService(rolesModel);
const usersService = new UsersService(usersModel, connectorRedisUsers);
const authController = new AuthController(authService);
const rolesController = new RolesController(rolesService);
const usersController = new UsersController(usersService);
const middleware = new Middleware(redisClient);
const routes = new Routes(authController, rolesController, usersController, middleware);
const app = new App(routes, dbPool, redisClient);

app.start();
