import { ModalProps } from 'models/interfaces';
import { ReservationType } from 'utils/enums/reservations.enum';

export interface SolicitationModalProps extends ModalProps {}

export interface SolicitationForm {
  building_id: number;
  optional_classroom: boolean;
  classroom_id?: number;
  optional_time: boolean;
  start_time?: string;
  end_time?: string;
  capacity: number;
  reason?: string;
  reservation_title: string;
  reservation_type: ReservationType;
}