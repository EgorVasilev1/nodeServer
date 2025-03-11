import { userRolesRoutes } from "./userRolesRoutes";
import { UserRolesController } from "./userRolesController";
import { UserRolesService } from "./userRolesService";
import { RolesModel } from "../roles/rolesModel";
import { UserRolesModel} from "./userRolesModel"
import { connectDB } from "../../databasePoolService/connectDB";

const rolesModel = new RolesModel(connectDB)
const model = new UserRolesModel(connectDB, rolesModel);
const service = new UserRolesService(model, rolesModel);
const controller = new UserRolesController(service);

export const UserRolesRoutes = userRolesRoutes(controller);

