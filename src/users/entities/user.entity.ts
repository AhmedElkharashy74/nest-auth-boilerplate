import { UserRole } from "./user-role.entity";

export class User {
    id: string;
    email?: string; // Changed from string | null to string | undefined
    username?: string;
    password?: string;
    name?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    roles?: UserRole[]; // Add this if you need roles
  }