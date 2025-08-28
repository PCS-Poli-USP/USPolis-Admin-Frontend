/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReservationResponse } from '../../../../../models/http/responses/reservation.response.models';
import { UseFormReturn } from 'react-hook-form';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { ReservationSecondForm } from '../Second/reservation.modal.steps.second.interface';
import { SolicitationResponse } from '../../../../../models/http/responses/solicitation.response.models';

export interface ReservationModalFirstStepProps {
  isUpdate: boolean;
  form: UseFormReturn<ReservationFirstForm, any, ReservationFirstForm>;
  secondForm: UseFormReturn<ReservationSecondForm, any, ReservationSecondForm>;
  selectedReservation?: ReservationResponse;
  setSelectedDays: (value: string[]) => void;
  setDates: (value: string[]) => void;
  vinculatedSolicitation?: SolicitationResponse;
  setVinculatedSolicitation: (value?: SolicitationResponse) => void;
  solicitations: SolicitationResponse[];
  loadingSolicitations: boolean;
}
export interface ReservationFirstForm {
  title: string;
  type: ReservationType;
  reason?: string;
  solicitation_id?: number;
  has_solicitation: boolean;
}
