import { RolePermission } from "./role-permission.entity";
import { UserRole } from "./user-role.entity";


export class Role {
    id: number;
    name: string;
    users?: UserRole[];
    permissions?: RolePermission[];
    createdAt: Date;
  }