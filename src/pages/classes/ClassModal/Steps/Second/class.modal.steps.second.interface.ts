import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { UseFormReturn } from 'react-hook-form';

export interface ClassModalSecondStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassSecondForm, any, ClassSecondForm>,
  calendars: CalendarResponse[];
  selectedClass?: ClassResponse;
}
export interface ClassSecondForm {
  start_date: string;
  end_date: string;
  calendar_ids: number[];
  recurrence: Recurrence;
  week_day: WeekDay;
  start_time: string;
  end_time: string;
}
