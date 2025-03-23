import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { OccurrenceResponse } from './occurrence.response.models';
import { AllocationLogResponse } from './allocationLog.response.models';

export interface ScheduleResponseBase {
  id: number;
  week_day?: WeekDay;
  month_week?: MonthWeek;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  allocated: boolean;
  recurrence: Recurrence;
  all_day: boolean;

  class_id?: number;
  subject?: string;
  subject_code?: string;
  class_code?: string;

  reservation_id?: number;
  reservation?: string;

  classroom_id?: number;
  classroom?: string;
  building_id?: number;
  building?: string;
}

export interface ScheduleResponse extends ScheduleResponseBase {
  occurrences_ids?: number[];
  occurrences?: OccurrenceResponse[];
  last_log?: AllocationLogResponse;
}

export interface ScheduleFullResponse extends ScheduleResponseBase {
  occurrences: OccurrenceResponse[];
  logs: AllocationLogResponse[];
}
