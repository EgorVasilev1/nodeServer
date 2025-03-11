import { rolesRoutes } from "./rolesRoutes";
import { RolesController } from "./rolesController";
import { authMiddleware } from "../../middleware/middleware";
import { RolesService } from "./rolesService";
import { RolesModel} from "./rolesModel"
import { connectDB } from "../../databasePoolService/connectDB";


const model = new RolesModel(connectDB);
const service = new RolesService(model);
const controller = new RolesController(service);

export const RolesRoutes = rolesRoutes(controller, authMiddleware);

