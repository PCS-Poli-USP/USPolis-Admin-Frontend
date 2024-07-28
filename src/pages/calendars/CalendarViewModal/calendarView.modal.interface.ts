import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import { ModalProps } from 'models/interfaces';

export interface CalendarViewModalProps extends ModalProps {
  calendar?: CalendarResponse;
}

export interface CalendarEventExtendedProps {
  created_by: string;
  category_name: string;
  name: string;
}

export interface CalendarEvent {
  title: string;
  date: string;
  extendedProps: CalendarEventExtendedProps;
}
