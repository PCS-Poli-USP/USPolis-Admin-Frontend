import { ClassroomFullResponse } from '../../../models/http/responses/classroom.response.models';
import { ModalProps } from '../../../models/interfaces';
import { MonthWeek } from '../../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';

export interface ScheduleDetails {
  recurrence: Recurrence | undefined | string;
  week_day: WeekDay | undefined | string;
  month_week: MonthWeek | undefined | string;
}

export interface ClassroomTimeGridProps extends ModalProps {
  classroom?: ClassroomFullResponse;
  preview: ClassroomPreview;
  scheduleDetails: ScheduleDetails;
  loading?: boolean;
  // Schedule already represented by `preview` (e.g. the reservation being
  // edited) - its own occurrences are skipped from classroom.schedules so
  // they aren't rendered twice.
  excludeScheduleId?: number;
}

export interface ClassroomEventExtendedProps {
  type: string;
  name: string;
  start: string;
  end: string;
}

export interface ClassroomPreview {
  title: string;
  start_time: string;
  end_time: string;
  dates: string[];
  start_times: string[];
  end_times: string[];
}

export interface ClassroomEvent {
  title: string;
  date: string;
  start: string; // Must be YYYY-MM-DDTHH:mm:ss
  end: string; // Must be YYYY-MM-DDTHH:mm:ss
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: ClassroomEventExtendedProps;
}
