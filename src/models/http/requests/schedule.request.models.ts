import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export interface ScheduleBase {
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  all_day: boolean;
  allocated?: boolean;
}

export interface CreateManySchedule extends ScheduleBase {
  week_days: WeekDay[];
  start_times: string[];
  end_times: string[];
}

export interface CreateSchedule extends ScheduleBase {
  class_id?: number;
  reservation_id?: number;
  classroom_id?: number;
  week_day?: WeekDay;
  start_time: string;
  end_time: string;
  dates?: string[];
}

export interface UpdateSchedule extends CreateSchedule {}
