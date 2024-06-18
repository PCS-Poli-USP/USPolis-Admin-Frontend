import { DayTime } from 'models/common/common.models';
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
  start_times: DayTime[];
  end_times: DayTime[];
}

export interface CreateSchedule extends ScheduleBase {
  class_id?: number;
  reservation_id?: number;
  classroom_id?: number;
  week_day?: WeekDay;
  start_time: DayTime;
  end_time: DayTime;
  dates?: string[];
}

export interface UpdateSchedule extends CreateSchedule {}
