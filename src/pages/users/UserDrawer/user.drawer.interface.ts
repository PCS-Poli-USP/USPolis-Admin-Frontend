import { GroupResponse } from '../../../models/http/responses/group.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';

export interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserCoreResponse;
  groups: GroupResponse[];
  refetch: () => void;
}

export interface UserDrawerForm {
  is_admin: boolean;
  group_ids: number[];
  receive_emails: boolean;
}
