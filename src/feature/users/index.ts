export { usersRoutes } from './usersRoutes';
export { UsersService } from './usersService';
import { UserRolesController } from "../../feature/userRoles/userRolesController";
import { UserRolesService } from "../../feature/userRoles/userRolesService";
import { UserRolesModel } from "../../feature/userRoles/userRolesModel";
import { RolesModel } from "../../feature/roles/rolesModel";
import { ConnectorDB } from "../../databasePoolService/connectDB";

export const initUserRolesDependencies = (db: ConnectorDB, rolesModel: RolesModel) => {
  const userRolesModel = new UserRolesModel(db, rolesModel);
  const userRolesService = new UserRolesService(userRolesModel, rolesModel);
  const userRolesController = new UserRolesController(userRolesService);
  
  return { userRolesController, userRolesService, userRolesModel };
};