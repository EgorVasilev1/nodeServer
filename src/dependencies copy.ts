import { ConnectorDB } from "./databasePoolService/connectDB";
import { ConnectorRedis } from "./redisClientService/connectorRedis";
import { initAuthDependencies } from "./feature/authTs/index";
import { initRolesDependencies } from "./feature/roles/index";
import { initUserRolesDependencies } from "./feature/users/index";
import { initUsersDependencies } from "./feature/userRoles/index"


export const initDependencies = (db: ConnectorDB, redis: ConnectorRedis) => {
  const rolesDependencies = initRolesDependencies(db);
  const usersDependencies = initUsersDependencies(db, redis);
  const userRolesDependencies = initUserRolesDependencies(db, rolesDependencies.rolesModel);
  const authDependencies = initAuthDependencies(db, redis);

  return { rolesDependencies, usersDependencies, userRolesDependencies, authDependencies };
};
