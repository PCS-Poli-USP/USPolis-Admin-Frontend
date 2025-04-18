import { AudiovisualType } from '../../../../../utils/enums/audiovisualType.enum';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { UseFormReturn } from 'react-hook-form';

export interface ClassModalFourthStepProps extends ClassModalStepsProps {
  form: UseFormReturn<ClassFourthForm, any, ClassFourthForm>;
  onNext: (data: ClassFourthForm) => void;
}
export interface ClassFourthForm {
  ignore_to_allocate: boolean;
  audiovisual: AudiovisualType;
  air_conditionating: boolean;
  accessibility: boolean;
}

export type fieldNames =
  | 'ignore_to_allocate'
  | 'audiovisual'
  | 'air_conditionating'
  | 'accessibility'
  | 'skip_exceptions';
