export { rolesRoutes } from './rolesRoutes';
export { RolesService } from './rolesService';
import { RolesController } from "../../feature/roles/rolesController";
import { RolesService } from "../../feature/roles/rolesService";
import { RolesModel } from "../../feature/roles/rolesModel";
import { ConnectorDB } from "../../databasePoolService/connectDB";

export const initRolesDependencies = (db: ConnectorDB) => {
  const rolesModel = new RolesModel(db);
  const rolesService = new RolesService(rolesModel);
  const rolesController = new RolesController(rolesService);
  
  return { rolesController, rolesService, rolesModel };
};