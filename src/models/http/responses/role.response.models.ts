import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionResponse } from './permissions.response.models';

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  resources: Resource[];
  permissions: PermissionResponse[];

  user_ids: number[];
  user_strs: string[];

  created_at: string;
  updated_at: string;
}
