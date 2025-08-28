import { ReservationResponse } from './reservation.response.models';

export interface MeetingResponse {
  id: number;
  link?: string;
  reservation: ReservationResponse;
}
