import moment from 'moment';
import { RoleResponse } from '../../models/http/responses/role.response.models';
import { Resource } from '../enums/resources.enums';
import { PermissionAction } from '../enums/actions.enums';

export interface RoleSummary {
  pills: string[];
  places: string[];
  granted: string[];
}

export function summarizeRole(role: RoleResponse): RoleSummary {
  const pills = new Set<string>();
  const places = new Set<string>();
  const granted = new Set<string>();
  role.permissions.forEach((permission) => {
    permission.actions.forEach((action) => {
      pills.add(
        `${Resource.translate(permission.resource)} · ${PermissionAction.translate(action, permission.resource)}`,
      );
    });
    places.add(
      permission.resource_name ||
        permission.parent_name ||
        `Todos: ${Resource.translate(permission.resource)}`,
    );
    if (permission.granted_by) {
      granted.add(
        `${permission.granted_by} · ${moment(permission.granted_at).format('DD/MM/YYYY')}`,
      );
    }
  });
  return {
    pills: Array.from(pills),
    places: Array.from(places),
    granted: Array.from(granted),
  };
}
