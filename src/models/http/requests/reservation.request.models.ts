import { ReservationType } from 'utils/enums/reservations.enum';
import { CreateSchedule, UpdateSchedule } from './schedule.request.models';

export interface ReservationBase {
  title: string;
  type: ReservationType;
  reason?: string;
  classroom_id: number;
}

export interface CreateReservation extends ReservationBase {
  schedule_data: CreateSchedule;
}

export interface UpdateReservation extends ReservationBase {
  schedule_data: UpdateSchedule;
}
