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

// Whether the user has anything beyond "common user": admin, or responsible for a building.
export function hasElevatedAccess(user: UserResponse) {
  return !!user.is_admin || !!(user.buildings && user.buildings.length > 0);
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
