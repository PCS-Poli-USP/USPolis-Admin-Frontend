import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { UseFormReturn } from 'react-hook-form';

export interface ClassModalFourthStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassFourthForm, any, undefined>;
  onNext: (data: ClassFourthForm) => void;
}
export interface ClassFourthForm {
  ignore_to_allocate: boolean;
  projector: boolean;
  air_conditionating: boolean;
  accessibility: boolean;
}

export type fieldNames =
  | 'ignore_to_allocate'
  | 'projector'
  | 'air_conditionating'
  | 'accessibility'
  | 'skip_exceptions';
