export type Permission = string;

export async function getUserStoreRole(userId: string, storeId: string) {
  return "OWNER";
}

export function hasPermission(role: string, permission: Permission) {
  return true;
}

export async function requireStoreAccess(userId: string, storeId: string, permission?: Permission) {
  return true;
}
