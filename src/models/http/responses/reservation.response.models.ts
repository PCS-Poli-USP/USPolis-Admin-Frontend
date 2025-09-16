import { ReservationType } from '../../../utils/enums/reservations.enum';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import { EventResponseBase } from './event.response.models';
import { ExamResponseBase } from './exam.response.models';
import { MeetingResponseBase } from './meeting.response.models';
import {
  ScheduleResponse,
  ScheduleFullResponse,
} from './schedule.response.models';

export interface ReservationResponseBase {
  id: number;
  title: string;
  type: ReservationType;
  reason?: string;
  updated_at: string;

  building_id: number;
  building_name: string;

  classroom_id?: number;
  classroom?: string;

  schedule_id: number;

  created_by_id: number;
  created_by: string;
  status: ReservationStatus;

  requester?: string;
  solicitation_id?: number;
}

export interface ReservationCoreResponse extends ReservationResponseBase {
  schedule: ScheduleResponse;
}

export interface ReservationResponse extends ReservationResponseBase {
  schedule: ScheduleResponse;
  exam?: ExamResponseBase;
  event?: EventResponseBase;
  meeting?: MeetingResponseBase;
}

export interface ReservationFullResponse extends ReservationResponseBase {
  schedule: ScheduleFullResponse;
}
