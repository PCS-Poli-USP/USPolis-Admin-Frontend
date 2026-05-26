import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';

export interface PermissionResponse {
  id: number;
  resource: Resource;
  action: PermissionAction;
  resource_id?: number;
  user_id?: number;
  role_id?: number;

  granted_by_id: number;
  granted_by: string;
  granted_at: string;
}
