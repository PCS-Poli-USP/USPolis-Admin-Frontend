import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { UseFormReturn } from 'react-hook-form';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ScheduleData } from '../../class.modal.interface';
import { ClassSecondForm } from '../Second/class.modal.steps.second.interface';

export interface ClassModalThirdStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassThirdForm, any, undefined>;
  secondForm: UseFormReturn<ClassSecondForm, any, undefined>;
  schedules: ScheduleData[];
  setSchedules: (schedules: ScheduleData[]) => void;
  onNext: () => void;
}
export interface ClassThirdForm {
  start_time?: string;
  end_time?: string;
  week_day?: WeekDay | string;
  month_week?: MonthWeek | string;
  recurrence?: Recurrence | string;
  schedule_start_date?: string;
  schedule_end_date?: string;
}

export type numberRange = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type fieldNames =
  | 'recurrence'
  | 'week_day'
  | 'month_week'
  | 'schedule_start_date'
  | 'schedule_end_date'
  | 'start_time'
  | 'end_time';
