import { ReservationType } from '../../../utils/enums/reservations.enum';
import { SolicitationStatus } from '../../../utils/enums/solicitationStatus.enum';

export interface ClassroomSolicitationResponse {
  id: number;
  classroom_id?: number;
  classroom?: string;
  required_classroom: boolean;
  building_id: number;
  building: string;
  dates: string[];
  reason?: string;
  reservation_title: string;
  reservation_type: ReservationType;
  user_id: number;
  user: string;
  email: string;
  start_time?: string;
  end_time?: string;
  capacity: number;
  status: SolicitationStatus;
  deleted_by?: string;
  closed_by?: string;
  created_at: string;
  updated_at: string;
}
