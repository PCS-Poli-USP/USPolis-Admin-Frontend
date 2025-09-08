import { MonthWeek } from '../../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';

export interface ScheduleBase {
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  all_day: boolean;
  allocated?: boolean;
}

export interface CreateSchedule extends ScheduleBase {
  class_id?: number;
  reservation_id?: number;
  classroom_id?: number;
  week_day?: WeekDay;
  start_time: string;
  end_time: string;
  dates?: string[];
  month_week?: MonthWeek;
  labels?: string[];
}

export interface CreateManySchedule {
  inputs: CreateSchedule[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateSchedule extends CreateSchedule {}

export interface ScheduleUpdateOccurences {
  dates: string[];
}
