import { EventExtendedProps, RecurrenceRule } from "models/http/responses/allocation.response.models";

export interface ClassroomsCalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  classroom_id?: number;
  classroom?: string;
  classroom_capacity?: number;

  rrule?: RecurrenceRule;
  allDay: boolean;
  resourceId: string;
  extendedProps: EventExtendedProps;
}