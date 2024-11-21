import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { UseFormReturn } from 'react-hook-form';
import { ClassType } from 'utils/enums/classes.enum';

export interface ClassModalFirstStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassFirstForm, any, undefined>,
  subjects: SubjectResponse[];
}
export interface ClassFirstForm {
  subject_id: number;
  code: string;
  type: ClassType;
  vacancies: number;
  subscribers: number;
  pendings: number;
  professors: string[];
}
