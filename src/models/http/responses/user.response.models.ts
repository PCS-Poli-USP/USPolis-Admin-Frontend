import { BuildingResponse } from './building.response.models';
import { SolicitationResponse } from './solicitation.response.models';

export interface UserInfoResponse {
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  is_admin: boolean;
  receive_emails: boolean;
  name: string;
  created_by: string;
  buildings?: BuildingResponse[];
  updated_at: string;
  last_visited: string;
  solicitations: Array<SolicitationResponse>;
  groups: Array<UserGroupResponse>;
  user_info?: UserInfoResponse;
}

export interface UserGroupResponse {
  id: number;
  name: string;
  building_id: number;
  building: string;
  main: boolean;
  classroom_strs: string[];
  classroom_ids: number[];
}
