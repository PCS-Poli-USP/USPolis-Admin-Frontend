import { ReservationCoreResponse } from './reservation.response.models';

export interface MeetingResponseBase {
  id: number;
  link?: string;
}

export interface MeetingResponse extends MeetingResponseBase {
  reservation: ReservationCoreResponse;
}
