import { ClassResponse } from '../../../../../models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { ClassFirstForm } from '../First/class.modal.steps.first.interface';
import { ClassSecondForm } from '../Second/class.modal.steps.second.interface';
import { ClassThirdForm } from '../Third/class.modal.steps.third.interface';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';
import { CalendarResponse } from '../../../../../models/http/responses/calendar.responde.models';
import { ScheduleData } from '../../class.modal.interface';
import { ClassFourthForm } from '../Fourth/class.modal.steps.fourth.interface';

interface ClassFormData {
  first: ClassFirstForm;
  second: ClassSecondForm;
  third: ClassThirdForm;
  fourth: ClassFourthForm;
}
export interface ClassModalFifthStepProps extends ClassModalStepsProps {
  data: ClassFormData;
  moveTo: (index: number) => void;
  subjects: SubjectResponse[];
  calendars: CalendarResponse[];
  schedules: ScheduleData[];
  selectedClass?: ClassResponse;
}
