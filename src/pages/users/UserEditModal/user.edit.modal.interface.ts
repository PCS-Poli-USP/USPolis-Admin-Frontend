import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { GroupResponse } from '../../../models/http/responses/group.response.models';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface UserEditModalProps extends ModalProps {
  user?: UserResponse;
  buildings: BuildingResponse[];
  groups: GroupResponse[];
  refetch: () => void;
}

export interface UserEditForm {
  is_admin: boolean;
  building_ids: number[];
  group_ids: number[];
  receive_emails: boolean;
}
