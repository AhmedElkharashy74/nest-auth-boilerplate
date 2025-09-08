import { RolePermission } from "./role-permission.entity";

export class Permission {
    id: number;
    action: string;
    resource: string;
    roles?: RolePermission[];
  }