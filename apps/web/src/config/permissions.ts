/**
 * RBAC Permission System
 * 
 * Granular permission checks instead of binary `role !== 'admin'`.
 * Used by API routes and middleware.
 */

export type Role = 'user' | 'admin' | 'rider';

export const PERMISSIONS = {
  // Orders
  'order:create':     ['user', 'admin'],
  'order:read:own':   ['user', 'rider'],
  'order:read:all':   ['admin'],
  'order:update':     ['admin'],
  'order:assign':     ['admin'],
  'order:accept':     ['rider'],
  'order:status':     ['rider', 'admin'],
  'order:cancel:own': ['user'],
  'order:cancel:any': ['admin'],
  'order:export':     ['admin'],

  // Products
  'product:read':     ['user', 'admin', 'rider'],
  'product:create':   ['admin'],
  'product:update':   ['admin'],
  'product:delete':   ['admin'],
  'product:import':   ['admin'],

  // Users
  'user:read:own':    ['user', 'rider', 'admin'],
  'user:read:all':    ['admin'],
  'user:update:own':  ['user', 'rider'],
  'user:update:any':  ['admin'],
  'user:ban':         ['admin'],

  // Riders
  'rider:list':       ['admin'],
  'rider:approve':    ['admin'],
  'rider:location':   ['admin'],
  'rider:commission': ['admin'],

  // Inventory
  'inventory:read':   ['admin'],
  'inventory:update': ['admin'],

  // Finance
  'wallet:read:own':  ['user', 'rider'],
  'wallet:read:all':  ['admin'],
  'wallet:credit':    ['admin'],
  'wallet:debit':     ['admin'],
  'refund:create':    ['admin'],

  // Analytics
  'analytics:read':   ['admin'],
  'analytics:export': ['admin'],

  // Notifications
  'notification:send':    ['admin'],
  'notification:read':    ['user', 'rider', 'admin'],

  // System
  'audit:read':       ['admin'],
  'settings:update':  ['admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles?.includes(role) ?? false;
}

/**
 * Assert permission — throws if denied
 */
export function assertPermission(role: Role | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new PermissionDeniedError(permission, role);
  }
}

export class PermissionDeniedError extends Error {
  public statusCode = 403;
  public code = 'PERMISSION_DENIED';

  constructor(permission: Permission, role?: Role) {
    super(`Role '${role || 'anonymous'}' lacks permission: ${permission}`);
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Get all permissions for a given role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return (Object.entries(PERMISSIONS) as [Permission, readonly string[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([perm]) => perm);
}
