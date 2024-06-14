import { CreateClass } from 'models/http/requests/class.request.models';
import { ClassFirstForm } from './First/class.modal.steps.first.interface';
import { ClassSecondForm } from './Second/class.modal.steps.second.interface';
import { ClassThirdForm } from './Third/class.modal.steps.third.interface';

export interface ClassModalStepsProps {
  isUpdate: boolean;
  onNext: (data: ClassFirstForm | ClassSecondForm | ClassThirdForm | CreateClass) => void;
}
