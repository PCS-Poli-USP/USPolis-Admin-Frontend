/* eslint-disable @typescript-eslint/no-empty-object-type */
import { EventType } from '../../../utils/enums/eventTypes.enum';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import {
  CreateReservation,
  UpdateReservation,
} from './reservation.request.models';

interface EventCreateBase extends CreateReservation {
  type: ReservationType.EVENT;
  event_type: EventType;
  link?: string;
}

interface EventUpdateBase extends UpdateReservation {
  type: ReservationType.EVENT;
  event_type: EventType;
  link?: string;
}

export interface CreateEvent extends EventCreateBase {}
export interface UpdateEvent extends EventUpdateBase {}
