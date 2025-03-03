import { DatabasePool } from "./config/db";
import { RedisClient } from "./config/redis";
import { ConnectorDB } from "./databasePoolService/connectDB";
import { ConnectorRedis } from "./redisClientService/connectorRedis";
import { AuthController } from "./feature/authTs/authController";
import { RolesController } from "./feature/roles/rolesController";
import { UsersController } from "./feature/users/usersController";
import { UsersModel } from "./feature/users/usersModel";
import { AuthService } from "./feature/authTs/authService";
import { RolesService } from "./feature/roles/rolesService";
import { RolesModel } from "./feature/roles/rolesModel";
import { UsersService } from "./feature/users/usersService";
import { UserRolesService } from "./feature/userRoles";
import { UserRolesModel } from "./feature/userRoles/userRolesModel";
import { UserRolesController } from "./feature/userRoles/userRolesController";
import { Middleware } from "./middleware/middleware";

const dbPool = new DatabasePool();
const db = new ConnectorDB(dbPool);
const redisClient = new RedisClient();
const redis = new ConnectorRedis(redisClient);

const usersModel = new UsersModel(db);
const rolesModel = new RolesModel(db);
const userRolesModel = new UserRolesModel(db, rolesModel);

const authService = new AuthService(usersModel, redis);
const rolesService = new RolesService(rolesModel);
const usersService = new UsersService(usersModel, redis);
const userRolesService = new UserRolesService(userRolesModel, rolesModel);

const authController = new AuthController(authService);
const rolesController = new RolesController(rolesService);
const usersController = new UsersController(usersService);
const userRolesController = new UserRolesController(userRolesService);

const middleware = new Middleware(redisClient);

export { authController, rolesController, usersController, userRolesController, middleware };