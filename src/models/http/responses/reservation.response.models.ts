import { ReservationType } from 'utils/enums/reservations.enum';
import {
  ScheduleResponse,
  ScheduleFullResponse,
} from './schedule.response.models';
import { ClassroomSolicitationResponse } from './classroomSolicitation.response.models';

export interface ReservationResponseBase {
  id: number;
  title: string;
  type: ReservationType;
  reason?: string;
  updated_at: string;

  building_id: number;
  building_name: string;

  classroom_id: number;
  classroom_name: string;

  schedule_id: number;

  created_by_id: number;
  created_by: string;

  requester?: string,
}

export interface ReservationResponse extends ReservationResponseBase {
  schedule: ScheduleResponse;
}

export interface ReservationFullResponse
  extends ReservationResponseBase {
  schedule: ScheduleFullResponse;
}
