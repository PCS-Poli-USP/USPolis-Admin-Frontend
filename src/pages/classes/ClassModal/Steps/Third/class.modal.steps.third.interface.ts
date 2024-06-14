import { ClassResponse } from 'models/http/responses/class.response.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';

export interface ClassModalThirdStepProps extends ClassModalStepsProps {
  subjects: SubjectResponse[];
  selectedClass?: ClassResponse;
}
export interface ClassThirdForm {
  subject_id: number;
  code: string;
  type: string;
  vacancies: number;
  subscribers: number;
  pendings: number;
  professors: string[];
}
