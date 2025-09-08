import { User } from "./user.entity";
import { Role } from "./role.entity";

export class UserRole {
    id: number;
    userId: string;
    roleId: number;
    user?: User;
    role?: Role;
  }