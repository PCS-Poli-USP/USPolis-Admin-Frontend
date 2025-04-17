import { UserResponse } from '../../models/http/responses/user.response.models';

export function getUserRole(user: UserResponse) {
  if (user.is_admin) return 'Administrador';
  if (user.buildings && user.buildings.length > 0)
    return 'Responsável por prédio';
  return 'Usuário comum';
}

export function getUserBuildings(user: UserResponse) {
  if (user.buildings && user.buildings.length > 0)
    return user.buildings.map((building) => building.name).join(', ');
  return 'Nenhum prédio associado';
}
