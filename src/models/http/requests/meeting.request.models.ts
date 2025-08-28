/* eslint-disable @typescript-eslint/no-empty-object-type */
import { CreateReservation } from './reservation.request.models';

interface MeetingBase extends CreateReservation {
  link?: string;
}

export interface CreateMeeting extends MeetingBase {}
export interface UpdateMeeting extends MeetingBase {}
