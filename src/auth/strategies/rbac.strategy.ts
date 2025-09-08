// auth/strategies/rbac.strategy.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/user.service';

@Injectable()
export class RbacStrategy {
  constructor(private usersService: UsersService) {}

  async hasPermission(userId: string, action: string, resource: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    
    if (!user || !user.roles) return false;
    
    // Check if user has any role with the required permission
    for (const userRole of user.roles) {
      if (userRole.role && userRole.role.permissions) {
        for (const rolePermission of userRole.role.permissions) {
          if (rolePermission.permission &&
              rolePermission.permission.action === action &&
              rolePermission.permission.resource === resource) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    
    if (!user || !user.roles) return false;
    
    return user.roles.some(
      userRole => userRole.role && userRole.role.name === roleName
    );
  }
}