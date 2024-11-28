import { UseFormReturn } from 'react-hook-form';
import { ReservationType } from 'utils/enums/reservations.enum';

export interface ReservationModalFirstStepProps {
  isUpdate: boolean;
  form: UseFormReturn<ReservationFirstForm, any, undefined>;
}
export interface ReservationFirstForm {
  title: string;
  type: ReservationType;
  reason?: string;
}
