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

export interface UserCoreResponse {
  id: number;
  email: string;
  is_admin: boolean;
  receive_emails: boolean;
  name: string;
  created_by: string;
  updated_at: string;
  user_info?: UserInfoResponse;
  last_visited: string;

  building_ids: number[];
  building_names: string[];
  
  group_ids: number[];
  group_names: string[];
}

export interface UserResponse extends UserCoreResponse {
  buildings?: BuildingResponse[];
  solicitations: Array<SolicitationResponse>;
  groups: Array<UserGroupResponse>;
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
