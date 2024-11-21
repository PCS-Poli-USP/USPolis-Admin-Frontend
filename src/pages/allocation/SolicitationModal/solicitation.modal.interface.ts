import { ModalProps } from 'models/interfaces';
import { ReservationType } from 'utils/enums/reservations.enum';

export interface SolicitationModalProps extends ModalProps {
  isMobile: boolean;
}

export interface SolicitationForm {
  building_id: number;
  optional_classroom: boolean;
  required_classroom: boolean;
  classroom_id?: number;
  optional_time: boolean;
  start_time?: string;
  end_time?: string;
  capacity: number;
  reason?: string;
  reservation_title: string;
  reservation_type: ReservationType;
}
