import { AllocationEventType } from '../../../utils/enums/allocation.event.type.enum';
import { MonthWeek } from '../../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import { ScheduleResponseBase } from './schedule.response.models';

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
export interface AllocationEventResponse {
  id: string;
  title: string;
  start: string; // Must be YYYY-MM-DDTHH:mm:ss
  end: string; // Must be YYYY-MM-DDTHH:mm:ss

  classroom_id?: number;
  classroom?: string;
  classroom_capacity?: number;
  rrule?: RecurrenceRule; // Used when is unallocated
  allDay: boolean;
  backgroundColor?: string;
  type: AllocationEventType;
  resourceId: string;
  extendedProps: EventExtendedProps;
}

// See https://fullcalendar.io/docs/resource-data
export interface AllocationResourceResponse {
  id: string;
  parentId?: string;
  title: string;
}

export interface BaseExtendedData {
  schedule_id: number;
  occurrence_id?: number;
  building: string;
  classroom: string;
  classroom_capacity?: number;
  recurrence: Recurrence;
  week_day?: WeekDay;
  month_week?: MonthWeek;
  start_time: string;
  end_time: string;
  start_date?: string;
  end_date?: string;
  label?: string;
}

export interface ClassExtendedData extends BaseExtendedData {
  code: string;
  subject_code: string;
  subject_name: string;
  allocated: boolean;
  professors: string[];
  vacancies: number;
}

export interface ReservationExtendedData extends BaseExtendedData {
  title: string;
  type: ReservationType;
  reason?: string;
  created_by: string;
  subject_id?: number;
  subject_code?: string;
  subject_name?: string;
  class_ids?: number[];
  class_codes?: string[];
}

export interface EventExtendedProps {
  class_data?: ClassExtendedData;
  reservation_data?: ReservationExtendedData;
}

export interface AllocationScheduleOptions {
  schedule_target_id: number;
  schedule_target: ScheduleResponseBase;
  options: ScheduleResponseBase[];
}

export interface AllocationClassOptions {
  class_id: number;
  class_code: string;
  schedule_options: AllocationScheduleOptions[];
}

export interface AllocationReuseTargetOptions {
  subject_id: number;
  subject_code: string;
  subject_name: string;
  class_options: AllocationClassOptions[];
}

export interface AllocationReuseResponse {
  building_id: number;
  allocation_year: number;
  target_options: AllocationReuseTargetOptions[];
  strict: boolean;
}
