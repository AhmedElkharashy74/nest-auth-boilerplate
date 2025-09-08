// src/common/interfaces/role-strategy.interface.ts
export interface RoleStrategy {
    /**
     * @param userRoles array of role names the user has, e.g. ['user','editor']
     * @param requiredRoles array of role names required for the endpoint
     * @returns whether user has access
     */
    hasAccess(userRoles: string[], requiredRoles: string[]): boolean;
  }
  