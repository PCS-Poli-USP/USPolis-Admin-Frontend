import { DayTime } from 'models/common/common.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export interface ScheduleResponseBase {
  id: number;
  week_day: WeekDay;
  start_date: string;
  end_date: string;
  start_time: DayTime;
  end_time: DayTime;
  skip_exceptions: boolean;
  allocated: boolean;
  recurrence: Recurrence;
  all_day: boolean;
  dates?: string[];
}

export interface ScheduleResponse extends ScheduleResponseBase {
  class_id?: number;
  reservation_id?: number;
  classroom_id?: number;
  classroom?: string;
  building_id?: number;
  building?: string;
}

export interface ScheduleUnfetchResponse extends ScheduleResponseBase {
  class_id?: number;
  classroom_id?: number;
}
