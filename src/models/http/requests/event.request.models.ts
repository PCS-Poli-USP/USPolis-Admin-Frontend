/* eslint-disable @typescript-eslint/no-empty-object-type */
import { EventType } from '../../../utils/enums/eventTypes.enum';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import { CreateReservation } from './reservation.request.models';

interface EventBase extends CreateReservation {
  type: ReservationType.EVENT;
  event_type: EventType;
  link?: string;
}

export interface CreateEvent extends EventBase {}
export interface UpdateEvent extends EventBase {}
