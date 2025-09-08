import { Role } from "./role.entity";
import { Permission } from "./permission.entity";


export class RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    role?: Role;
    permission?: Permission;
  }