import { Recurrence } from 'utils/enums/recurrence.enum';

export interface ScheduleModalProps {}

interface ScheduleFormBase {
  calendar_id: number;
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  skip_exceptions: boolean;
  all_day: boolean;
  allocated?: boolean;
}

export interface ScheduleForm extends ScheduleFormBase {
  week_day: number;
  start_time: string;
  end_time: string;
}
