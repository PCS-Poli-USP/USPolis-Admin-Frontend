import { BuildingResponse } from 'models/http/responses/building.response.models';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';

export interface User {
  id: string;
  name?: string;
  is_admin: boolean;
  email: string;
  updated_at: string;
  created_by?: string;
  buildings?: Array<BuildingResponse>;
  solicitations: Array<ClassroomSolicitationResponse>;
}
