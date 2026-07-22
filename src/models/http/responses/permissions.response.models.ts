import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';

export interface PermissionResponse {
  id: number;
  resource: Resource;
  actions: PermissionAction[];
  resource_id?: number;
  resource_name?: string;

  parent_id?: number;
  parent_name?: string;
  parent_resource?: Resource;

  role_id: number;
  role_name: string;

  granted_by_id: number;
  granted_by: string;
  granted_at: string;
}
