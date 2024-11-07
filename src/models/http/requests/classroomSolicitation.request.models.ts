import { ReservationType } from 'utils/enums/reservations.enum';

export interface CreateClassroomSolicitation {
  classroom_id?: number;
  required_classroom: boolean;
  building_id: number;
  reason?: string;
  reservation_title: string;
  reservation_type: ReservationType;
  dates: string[];
  start_time?: string;
  end_time?: string;
  capacity: number;
}

export interface ClassroomSolicitationAprove {
  classroom_id: number;
  classroom_name: string;
  start_time: string;
  end_time: string;
}

export interface ClassroomSolicitationDeny {
  justification: string;
}
