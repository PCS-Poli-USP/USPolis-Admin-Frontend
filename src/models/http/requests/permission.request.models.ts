import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';

export interface CreatePermission {
  resource: Resource;
  resource_id?: number;
  actions: PermissionAction[];
  user_id?: number;
  role_id?: number;
}
