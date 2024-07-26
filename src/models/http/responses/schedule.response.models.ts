import { Occurrence } from 'models/common/occurrence.models';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { OccurrenceResponse } from './occurrence.response.models';

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
  reservation_id?: number;
  classroom_id?: number;
  classroom?: string;
  building_id?: number;
  building?: string;
}

export interface ScheduleResponse extends ScheduleResponseBase {
  occurrences_ids?: number[];
  occurrences?: Occurrence[];
}

export interface ScheduleWithOccurrencesResponse extends ScheduleResponseBase {
  occurrences: OccurrenceResponse[];
}
