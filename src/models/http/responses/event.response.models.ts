import { EventType } from '../../../utils/enums/eventTypes.enum';
import { ReservationCoreResponse } from './reservation.response.models';

export interface EventResponseBase {
  id: number;
  reservation_id: number;
  link?: string;
  type: EventType;
}

export interface EventResponse extends EventResponseBase {
  reservation: ReservationCoreResponse;
}
