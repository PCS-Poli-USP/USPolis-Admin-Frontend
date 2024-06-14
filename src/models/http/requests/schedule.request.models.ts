import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export interface ScheduleBase {
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  skip_exceptions: boolean;
  all_day: boolean;
  allocated?: boolean;
}

export interface CreateManySchedule extends ScheduleBase {
  week_days: WeekDay[];
  start_times: string[];
  end_times: string[];
}

export interface CreateSchedule extends ScheduleBase {
  week_day: WeekDay;
  start_time: string;
  end_time: string;
}
