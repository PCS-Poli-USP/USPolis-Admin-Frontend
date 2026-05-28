import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface RoleModalProps extends ModalProps {
  isUpdate: boolean;
  handleSave: () => void;
  handleClose: () => void;
  permissions: PermissionResponse[];
  loading?: boolean;
  refetch: () => void;
  selectedRole?: RoleResponse;
}

export interface RoleForm {
  name: string;
  description: string;
  permission_ids: number[];
}
