export { userRolesRoutes } from './userRolesRoutes';
export { UserRolesService } from './userRolesService';
import { UsersController } from "../../feature/users/usersController";
import { UsersService } from "../../feature/users/usersService";
import { UsersModel } from "../../feature/users/usersModel";
import { ConnectorDB } from "../../databasePoolService/connectDB";
import { ConnectorRedis } from "../../redisClientService/connectorRedis";

export const initUsersDependencies = (db: ConnectorDB, redis: ConnectorRedis) => {
  const usersModel = new UsersModel(db);
  const usersService = new UsersService(usersModel, redis);
  const usersController = new UsersController(usersService);
  
  return { usersController, usersService, usersModel };
};