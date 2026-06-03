import { ScheduleResponseBase } from './schedule.response.models';
import { UserAbsenceResponse } from './userAbsence.response.models';

export interface UserScheduleEntryResponse {
  user_schedule_id: number;
  schedule_id: number;
  absence_count: number;
  schedule_data: ScheduleResponseBase;
  absences: UserAbsenceResponse[];
}
