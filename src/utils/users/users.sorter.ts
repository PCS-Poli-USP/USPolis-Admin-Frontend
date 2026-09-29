import {
  UserCoreResponse,
  UserPermissionResponse,
} from '../../models/http/responses/user.response.models';

export function sortUsersResponse(A: UserCoreResponse, B: UserCoreResponse) {
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}

export function sortUsersPermissions(
  A: UserPermissionResponse,
  B: UserPermissionResponse,
) {
  const roleDiff = B.roles.length - A.roles.length;
  if (roleDiff !== 0) return roleDiff;

  const permissionDiff = B.permissions.length - A.permissions.length;
  if (permissionDiff !== 0) return permissionDiff;
  return A.name.localeCompare(B.name);
}
