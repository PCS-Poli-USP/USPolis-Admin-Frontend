import { ClassResponseBase } from './class.response.models';
import { ReservationResponse } from './reservation.response.models';
import { RecurrenceRule } from './allocation.response.models';

export interface ExamResponse {
  id: number;
  reservation_id: number;
  subject_id: number;
  subject_code: string;
  subject_name: string;

  reservation: ReservationResponse;
  classes: ClassResponseBase[];
}

export interface ExamEventExtendedProps {
  subject_code: string;
}

export interface ExamEventResponse {
  id: string;
  title: string;
  start: string;
  end: string;

  rrule: RecurrenceRule;
  resourceId?: string;
  extendedProps?: ExamEventExtendedProps;
}
