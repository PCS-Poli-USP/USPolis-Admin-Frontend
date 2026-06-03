import { ClassResponseBase } from '../../models/http/responses/class.response.models';
import { ScheduleResponse } from '../../models/http/responses/schedule.response.models';

export interface TimetableEventExtendedProps {
  scheduleData?: ScheduleResponse;
  classData?: ClassResponseBase;
  subjectCode?: string;
  classId?: number;
}

export interface TimetableEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  startTime?: string;
  endTime?: string;
  extendedProps: TimetableEventExtendedProps;
}
