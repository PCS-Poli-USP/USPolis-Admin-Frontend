import { UserAccessResponse } from '../../models/http/responses/access.response.models';
import { belongsToAnyBuilding } from '../access/access';
import {
  UserCoreResponse,
  UserResponse,
} from '../../models/http/responses/user.response.models';

export function getUserRole(user: UserResponse) {
  if (user.is_admin) return 'Administrador';
  if (user.buildings && user.buildings.length > 0)
    return 'Responsável por prédio';
  return 'Usuário comum';
}

export function getUserRoleBadgeColor(user: UserResponse) {
  if (user.is_admin) return 'orange';
  if (user.buildings && user.buildings.length > 0) return 'green';
  return 'gray';
}

export function getUserBuildings(user: UserResponse) {
  if (user.buildings && user.buildings.length > 0)
    return user.buildings.map((building) => building.name).join(', ');
  return 'Nenhum prédio associado';
}

export function getUserBuildingsBadgeColor(user: UserResponse) {
  if (user.buildings && user.buildings.length > 0) return 'green';
  return 'gray';
}

// Whether the user has anything beyond "common user": admin, or belongs to a
// building (a role or a group gives them something in it, GET /users/my-access).
export function hasElevatedAccess(
  user: UserResponse,
  access: UserAccessResponse | null,
) {
  return !!user.is_admin || belongsToAnyBuilding(access);
}

// Same gate as the backend's restricted tier (restricted_authenticate): admin,
// or a building (from a group) or a role. Each page still gets per-object
// permissions from the API.
export function hasRestrictedAccess(user: UserResponse | null | undefined) {
  if (!user) return false;
  return (
    !!user.is_admin ||
    !!(user.buildings && user.buildings.length > 0) ||
    !!(user.role_ids && user.role_ids.length > 0)
  );
}

export function getUserCoreRole(user: UserCoreResponse) {
  if (user.is_admin) return 'Administrador';
  if (user.building_names.length > 0) return 'Responsável por prédio';
  return 'Usuário comum';
}

export function getUserCoreRoleBadgeColor(user: UserCoreResponse) {
  if (user.is_admin) return 'orange';
  if (user.building_names.length > 0) return 'green';
  return 'gray';
}
