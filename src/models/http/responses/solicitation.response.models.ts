import { SolicitationStatus } from '../../../utils/enums/solicitationStatus.enum';
import { ReservationResponse } from './reservation.response.models';

export interface SolicitationResponse {
  id: number;
  capacity: number;
  required_classroom: boolean;
  status: SolicitationStatus;
  closed_by?: string;
  deleted_by?: string;
  created_at: string;
  updated_at: string;

  user_id: number;
  user: string;
  email: string;

  building_id: number;
  building: string;

  reservation: ReservationResponse;
}
