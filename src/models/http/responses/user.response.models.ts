import { BuildingResponse } from './building.response.models';
import { ClassroomSolicitationResponse } from './classroomSolicitation.response.models';
import { GroupResponse } from './group.response.models';

export interface UserInfoResponse {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  hd: string;
}

export interface UserResponse {
  id: number;
  email: string;
  is_admin: boolean;
  name: string;
  created_by: string;
  buildings?: BuildingResponse[];
  updated_at: string;
  last_visited: string;
  solicitations: Array<ClassroomSolicitationResponse>;
  groups: Array<GroupResponse>;
  user_info?: UserInfoResponse;
}
