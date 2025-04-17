import { ReservationResponse } from '../../../../../models/http/responses/reservation.response.models';
import { UseFormReturn } from 'react-hook-form';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { ReservationSecondForm } from '../Second/reservation.modal.steps.second.interface';
import { ClassroomSolicitationResponse } from '../../../../../models/http/responses/classroomSolicitation.response.models';


export interface ReservationModalFirstStepProps {
  isUpdate: boolean;
  form: UseFormReturn<ReservationFirstForm, any, undefined>;
  secondForm: UseFormReturn<ReservationSecondForm, any, undefined>;
  selectedReservation?: ReservationResponse;
  setSelectedDays: (value: string[]) => void;
  setDates: (value: string[]) => void;
  vinculatedSolicitation?: ClassroomSolicitationResponse;
  setVinculatedSolicitation: (value?: ClassroomSolicitationResponse) => void;
  solicitations: ClassroomSolicitationResponse[];
  loadingSolicitations: boolean;
}
export interface ReservationFirstForm {
  title: string;
  type: ReservationType;
  reason?: string;
  solicitation_id?: number;
  has_solicitation: boolean;
}
