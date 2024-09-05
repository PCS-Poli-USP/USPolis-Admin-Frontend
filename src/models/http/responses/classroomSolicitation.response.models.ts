export interface ClassroomSolicitationResponse {
  id: number;
  classroom_id: number;
  classroom: string;
  building_id: number;
  building: string;
  date: string;
  reason: string;
  email: string;
  start_time: string;
  end_time: string;
  capacity: number;
  approved: boolean;
  denied: boolean;
  closed: boolean;
  created_at: string;
  updated_at: string;
}
