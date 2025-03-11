import { usersRoutes } from "./usersRoutes";
import { UsersController } from "./usersController";
import { authMiddleware } from "../../middleware/middleware";
import { UsersService } from "./usersService";
import { UsersModel} from "./usersModel"
import { connectDB } from "../../databasePoolService/connectDB";
import { connectRedis } from "../../redisClientService/connectorRedis";

const model = new UsersModel(connectDB);
const service = new UsersService(model, connectRedis);
const controller = new UsersController(service);

export const UserRoutes = usersRoutes(controller, authMiddleware);

