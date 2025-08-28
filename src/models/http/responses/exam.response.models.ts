import { ClassResponseBase } from './class.response.models';
import { ReservationResponse } from './reservation.response.models';

export interface ExamResponse {
  id: number;
  reservation_id: number;
  subject_id: number;
  subject_code: string;
  subject_name: string;

  reservation: ReservationResponse;
  classes: ClassResponseBase[];
}
