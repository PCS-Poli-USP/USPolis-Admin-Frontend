/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReservationResponse } from '../../../../../models/http/responses/reservation.response.models';
import { UseFormReturn } from 'react-hook-form';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { ReservationSecondForm } from '../Second/reservation.modal.steps.second.interface';
import { EventType } from '../../../../../utils/enums/eventTypes.enum';
import { ClassResponse } from '../../../../../models/http/responses/class.response.models';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';

export interface ReservationModalFirstStepProps {
  isUpdate: boolean;
  form: UseFormReturn<ReservationFirstForm, any, ReservationFirstForm>;
  secondForm: UseFormReturn<ReservationSecondForm, any, ReservationSecondForm>;
  selectedReservation?: ReservationResponse;
  setSelectedDays: (value: string[]) => void;
  setDates: (value: string[]) => void;
  subjects: SubjectResponse[];
  classes: ClassResponse[];
  loading: boolean;
}
export interface ReservationFirstForm {
  title: string;
  type: ReservationType;
  reason?: string;
  link?: string;
  subject_id?: number;
  class_ids?: number[];
  event_type?: EventType;
}
