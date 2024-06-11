import { DayTime } from "models/common/common.models";
import { Recurrence } from "utils/enums/recurrence.enum";
import { WeekDay } from "utils/enums/weekDays.enum";
import { ClassroomResponse } from "./classroom.response.models";
import { ReservationResponse } from "./reservation.response.models";

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
}

export interface ScheduleResponse extends ScheduleResponseBase {
  classroom?: ClassroomResponse;
  class_id?: number;
  reservation?: ReservationResponse;
}

export interface ScheduleUnfetchResponse extends ScheduleResponseBase {}
