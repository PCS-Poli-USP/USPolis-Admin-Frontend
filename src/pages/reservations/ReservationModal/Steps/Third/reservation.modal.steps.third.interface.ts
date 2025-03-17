import { UseFormReturn } from 'react-hook-form';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';

export interface ReservationModalThirdStepProps {
  isUpdate: boolean;
  form: UseFormReturn<ReservationThirdForm, any, undefined>;
  selectedReservation?: ReservationResponse;
}
export interface ReservationThirdForm {
  solicitation_id?: number;
  has_solicitation: boolean;
}
