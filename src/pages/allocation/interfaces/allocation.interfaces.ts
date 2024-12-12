import { EventResponse } from 'models/http/responses/allocation.response.models';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ReservationType } from 'utils/enums/reservations.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export interface Resource {
  id: string;
  parentId?: string;
  title: string;
  eventColor?: string;
  eventBackgroundColor?: string;
  eventBorderColor?: string;
  eventTextColor?: string;
}

export interface RecurrenceRule {
  dtstart: string; // Must be YYYY-MM-DDTHH:mm:ss
  until: string; // Must be YYYY-MM-DDTHH:mm:ss
  freq: string;
  interval: number;
  byweekday: string[];
  bysetpos?: number;
}

// See https://fullcalendar.io/docs/event-parsing
export interface Event extends EventResponse {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface BaseExtendedProps {
  building: string;
  classroom: string;
  recurrence: Recurrence;
  week_day?: WeekDay;
  month_week?: MonthWeek;
  start_time: string;
  end_time: string;
  start_date?: string;
  end_date?: string;
}

export interface ClassExtendedProps extends BaseExtendedProps {
  code: string;
  subject_code: string;
  subject_name: string;
  allocated: boolean;
  professors: string[];
  week_day?: WeekDay;
  subscribers: number;
}

export interface ReservationExtendedProps extends BaseExtendedProps {
  title: string;
  type: ReservationType;
  reason?: string;
  created_by: string;
}

export interface EventExtendedProps {
  class_data?: ClassExtendedProps;
  reservation_data?: ReservationExtendedProps;
}
