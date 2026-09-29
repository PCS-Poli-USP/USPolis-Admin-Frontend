import { Resource } from '../../../utils/enums/resources.enums';
import { CreatePermission } from './permission.request.models';

export interface CreateRole {
  name: string;
  resources: Resource[];
  description?: string;

  permissions: CreatePermission[];
  user_ids?: number[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateRole extends CreateRole {}
