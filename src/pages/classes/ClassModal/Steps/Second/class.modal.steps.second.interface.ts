import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';

export interface ClassModalSecondStepProps extends ClassModalStepsProps {
  isUpdate: boolean;
  calendars: CalendarResponse[];
  selectedClass?: ClassResponse;
}
export interface ClassSecondForm {
  subject_id: number;
  code: string;
  type: string;
  vacancies: number;
  subscribers: number;
  pendings: number;
  professors: string[];
}
