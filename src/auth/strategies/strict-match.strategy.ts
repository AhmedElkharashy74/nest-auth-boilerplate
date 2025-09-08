// src/common/strategies/strict-match.strategy.ts

export class StrictMatchStrategy {
  hasAccess(userRoles: string[], requiredRoles: string[]): boolean {
    // require all requiredRoles to be present
    return requiredRoles.every((r) => userRoles.includes(r));
  }
}