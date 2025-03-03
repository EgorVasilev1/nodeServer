export { authRoutes } from './authRoutes';
export { AuthService } from './authService';
import { UsersModel } from "../../feature/users/usersModel";
import { AuthController } from "../../feature/authTs/authController";
import { AuthService } from "../../feature/authTs/authService";
import { ConnectorDB } from "../../databasePoolService/connectDB";
import { ConnectorRedis } from "../../redisClientService/connectorRedis";

export const initAuthDependencies = (db: ConnectorDB, redis: ConnectorRedis) => {
  const usersModel = new UsersModel(db);
  const authService = new AuthService(usersModel, redis);
  const authController = new AuthController(authService);
  
  return { authController, authService, usersModel };
};