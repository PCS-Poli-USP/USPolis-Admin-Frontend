/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ReservationType } from '../../../utils/enums/reservations.enum';
import {
  CreateReservation,
  UpdateReservation,
} from './reservation.request.models';

interface ExamCreateBase extends CreateReservation {
  type: ReservationType.EXAM;
  subject_id: number;
  class_ids: number[];
}

interface ExamUpdateBase extends UpdateReservation {
  type: ReservationType.EXAM;
  subject_id: number;
  class_ids: number[];
}

export interface CreateExam extends ExamCreateBase {}
export interface UpdateExam extends ExamUpdateBase {}
