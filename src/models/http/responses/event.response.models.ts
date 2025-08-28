import { EventType } from '../../../utils/enums/eventTypes.enum';
import { ReservationResponse } from './reservation.response.models';

export interface EventResponse {
  id: number;
  reservation_id: number;
  link?: string;
  type: EventType;

  reservation: ReservationResponse;
}
