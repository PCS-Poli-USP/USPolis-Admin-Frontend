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

// See https://fullcalendar.io/docs/event-parsing
export interface Event {
  id: string;
  title: string; 
  start?: string; // Must be YYYY-MM-DDTHH:mm:ss 
  end?: string; // Must be YYYY-MM-DDTHH:mm:ss
  startRecur?: string; // Don't use with start or end
  endRecur?: string; // Don't use with start or end
  startTime?: string; // Don't use with start or end
  endTime?: string; // Don't use with start or end
  daysOfWeek?: number[];
  allDay: boolean;
  resourceId: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: EventExtendedProps;
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
  name: string;
  type: ReservationType;
  description?: string;
  created_by: string;
}

export interface EventExtendedProps {
  class_data?: ClassExtendedProps;
  reservation_data?: ReservationExtendedProps;
}
