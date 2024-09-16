import { ReservationType } from "utils/enums/reservations.enum";

export interface CreateClassroomSolicitation {
  classroom_id?: number;
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
  start_time: string;
  end_time: string;
}
