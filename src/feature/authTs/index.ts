import { authRoutes } from "./authRoutes";
import { AuthController } from "./authController";
import { authMiddleware } from "../../middleware/middleware";
import { AuthService } from "./authService";
import { UsersModel} from "../users/usersModel"
import { connectDB } from "../../databasePoolService/connectDB";
import { connectRedis } from "../../redisClientService/connectorRedis";

const model = new UsersModel(connectDB);
const service = new AuthService(model, connectRedis);
const controller = new AuthController(service);

export const AuthRoutes = authRoutes(controller, authMiddleware);

