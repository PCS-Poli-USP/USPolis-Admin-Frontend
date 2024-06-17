import { ClassResponse } from 'models/http/responses/class.response.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { UseFormReturn } from 'react-hook-form';

export interface ClassModalThirdStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassThirdForm, any, ClassThirdForm>;
  subjects: SubjectResponse[];
  onNext: (data: ClassThirdForm) => void;
  selectedClass?: ClassResponse;
}
export interface ClassThirdForm {
  ignore_to_allocate: boolean;
  projector: boolean;
  air_conditionating: boolean;
  accessibility: boolean;
  skip_exceptions: boolean;
}

export type fieldNames =
  | 'ignore_to_allocate'
  | 'projector'
  | 'air_conditionating'
  | 'accessibility'
  | 'skip_exceptions';
