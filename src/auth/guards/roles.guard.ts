// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacStrategy } from '../strategies/rbac.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacStrategy: RbacStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<{ action: string; resource: string }[]>(
      'permissions',
      context.getHandler(),
    );

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // If no permissions or roles are required, allow access
    if ((!requiredPermissions || requiredPermissions.length === 0) && 
        (!requiredRoles || requiredRoles.length === 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check roles first
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = await Promise.all(
        requiredRoles.map(role => this.rbacStrategy.hasRole(user.id, role))
      );
      
      if (hasRole.some(result => result)) {
        return true;
      }
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = await Promise.all(
        requiredPermissions.map(permission => 
          this.rbacStrategy.hasPermission(user.id, permission.action, permission.resource))
      );
      
      if (hasPermission.every(result => result)) {
        return true;
      }
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}