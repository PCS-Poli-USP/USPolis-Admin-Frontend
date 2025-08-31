/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  CreateReservation,
  UpdateReservation,
} from './reservation.request.models';

interface MeetingCreateBase extends CreateReservation {
  link?: string;
}

interface MeetingUpdateBase extends UpdateReservation {
  link?: string;
}

export interface CreateMeeting extends MeetingCreateBase {}
export interface UpdateMeeting extends MeetingUpdateBase {}
