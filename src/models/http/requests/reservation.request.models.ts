import { CreateSchedule, UpdateSchedule } from './schedule.request.models';

interface ReservationBase {
  name: string;
  type: string;
  description: string;
  classroom_id: number;
}

export interface CreateReservation extends ReservationBase {
  schedule_data: CreateSchedule;
}

export interface UpdateReservation extends ReservationBase {
  schedule_data: UpdateSchedule;
}
