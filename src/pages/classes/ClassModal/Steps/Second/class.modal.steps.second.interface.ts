import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import { UseFormReturn } from 'react-hook-form';
import { ClassThirdForm } from '../Third/class.modal.steps.third.interface';

export interface ClassModalSecondStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassSecondForm, any, undefined>;
  thirdForm: UseFormReturn<ClassThirdForm, any, undefined>;
  calendars: CalendarResponse[];
  onNext: (data: ClassSecondForm) => void;
}
export interface ClassSecondForm {
  start_date: string;
  end_date: string;
  calendar_ids: number[];
}
