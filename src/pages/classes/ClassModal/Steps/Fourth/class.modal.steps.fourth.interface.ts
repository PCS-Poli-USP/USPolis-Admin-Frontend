import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';

export interface ClassModalFourthStepProps extends ClassModalStepsProps {
  onNext: () => void;
  selectedClass?: ClassResponse;
}
