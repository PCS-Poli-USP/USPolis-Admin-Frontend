import { ClassResponseBase } from './class.response.models';
import { ReservationCoreResponse } from './reservation.response.models';
import { RecurrenceRule } from './allocation.response.models';

export interface ExamResponseBase {
  id: number;
  reservation_id: number;
  subject_id: number;
  subject_code: string;
  subject_name: string;
}

export interface ExamResponse extends ExamResponseBase {
  reservation: ReservationCoreResponse;
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
