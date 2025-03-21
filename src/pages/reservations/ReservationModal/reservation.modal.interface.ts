import { BuildingResponse } from 'models/http/responses/building.response.models';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { ModalProps } from 'models/interfaces';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export interface ReservationModalProps extends ModalProps {
  isUpdate: boolean;
  classrooms: ClassroomResponse[];
  buildings: BuildingResponse[];
  selectedReservation?: ReservationResponse;
  solicitations: ClassroomSolicitationResponse[];
  loadingSolicitations: boolean;
  refetch: () => void;
  initialDate?: string;
}

export interface ReservationForm {
  title: string;
  type: string;
  reason?: string;

  building_id: number;
  classroom_id: number;

  start_time: string;
  end_time: string;

  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  week_day?: WeekDay;
  month_week?: MonthWeek;
}
