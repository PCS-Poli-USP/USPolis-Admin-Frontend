/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ReservationType } from '../../../utils/enums/reservations.enum';
import { CreateReservation } from './reservation.request.models';

interface ExamBase extends CreateReservation {
  type: ReservationType.EXAM;
  subject_id: number;
  class_ids: number[];
}

export interface CreateExam extends ExamBase {}
export interface UpdateExam extends ExamBase {}
