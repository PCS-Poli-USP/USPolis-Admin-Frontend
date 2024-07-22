import { BuildingResponse } from './building.response.models';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  name: string;
  created_by: string;
  buildings?: BuildingResponse[];
  updated_at: string;
}
