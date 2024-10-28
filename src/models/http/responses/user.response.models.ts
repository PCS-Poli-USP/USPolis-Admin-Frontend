import { BuildingResponse } from './building.response.models';
import { ClassroomSolicitationResponse } from './classroomSolicitation.response.models';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  name: string;
  created_by: string;
  buildings?: BuildingResponse[];
  updated_at: string;
  solicitations: Array<ClassroomSolicitationResponse>;
}
