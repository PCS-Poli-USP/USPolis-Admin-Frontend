import { ReservationType } from '../../../utils/enums/reservations.enum';
import { CreateSchedule, UpdateSchedule } from './schedule.request.models';

export interface ReservationBase {
  title: string;
  type: ReservationType;
  reason?: string;
  classroom_id: number;
}

export interface CreateReservation extends ReservationBase {
  schedule_data: CreateSchedule;
  has_solicitation: boolean;
  solicitation_id?: number;
}

export interface UpdateReservation extends ReservationBase {
  schedule_data: UpdateSchedule;
  has_solicitation: boolean;
  solicitation_id?: number;
}
