import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { UseFormReturn } from 'react-hook-form';
import { ScheduleData } from '../../class.modal.interface';

export interface ClassModalSecondStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassSecondForm, any, ClassSecondForm>;
  calendars: CalendarResponse[];
  schedules: ScheduleData[];
  setSchedules: (schedules: ScheduleData[]) => void;
  selectedClass?: ClassResponse;
}
export interface ClassSecondForm {
  start_date: string;
  end_date: string;
  calendar_ids: number[];
  start_time?: string;
  end_time?: string;
  week_day?: WeekDay;
  recurrence?: Recurrence;
  schedule_start_date?: string;
  schedule_end_date?: string;
}

export type numberRange = 0 | 1 | 2 | 3 | 4 | 5;
export type fieldNames =
  | 'recurrence'
  | 'week_day'
  | 'schedule_start_date'
  | 'schedule_end_date'
  | 'start_time'
  | 'end_time';
