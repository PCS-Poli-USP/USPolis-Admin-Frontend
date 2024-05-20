import { User } from 'models/common/user.common.model';

export interface Holiday {
  id: string;
  name: string;
  created_by: User;
}
