/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form';
import { WeekDay } from '../../../../../utils/enums/weekDays.enum';
import { MonthWeek } from '../../../../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../../../../utils/enums/recurrence.enum';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import { ClassroomResponse } from '../../../../../models/http/responses/classroom.response.models';
import { ReservationResponse } from '../../../../../models/http/responses/reservation.response.models';
import { DateCalendarPickerReturn } from '../../../../../components/common/DateCalendarPicker/hooks/useDateCalendarPicker';
import { ReservationFirstForm } from '../First/reservation.modal.steps.first.interface';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';

export interface ReservationModalSecondStepProps
  extends DateCalendarPickerReturn {
  isUpdate: boolean;
  buildings: BuildingResponse[];
  classrooms: ClassroomResponse[];
  setDates: (value: string[]) => void;
  form: UseFormReturn<ReservationSecondForm, any, ReservationSecondForm>;
  firstForm: UseFormReturn<ReservationFirstForm, any, ReservationFirstForm>;
  selectedReservation?: ReservationResponse;
  initialDate?: string;
}
export interface ReservationSecondForm {
  building_id: number;
  classroom_id: number;

  start_time: string;
  end_time: string;

  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  week_day?: WeekDay | string;
  month_week?: MonthWeek | string;

  type?: ReservationType;
  labels?: string[];
}
