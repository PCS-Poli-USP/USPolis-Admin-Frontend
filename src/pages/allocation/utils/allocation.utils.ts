import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ReservationType } from 'utils/enums/reservations.enum';
import moment from 'moment';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { BuildingResponse } from 'models/http/responses/building.response.models';

export function loadReservationForDataClick(
  classroom: string,
  building: string,
  date: string,
  classrooms: ClassroomResponse[],
  buildings: BuildingResponse[],
): ReservationResponse {
  return {
    id: 0,
    title: '',
    type: ReservationType.OTHER,
    updated_at: '',
    building_id:
      buildings.find((building_) => building_.name === building)?.id || 0,
    building_name: building,
    classroom_id:
      classrooms.find((classroom_) => classroom_.name === classroom)?.id || 0,
    classroom_name: classroom,
    schedule_id: 0,
    created_by_id: 0,
    created_by: '',
    has_solicitation: false,
    solicitation_id: undefined,
    schedule: {
      id: 0,
      week_day: undefined,
      month_week: undefined,
      start_date: moment(date).format('YYYY-MM-DD'),
      end_date: moment(date).format('YYYY-MM-DD'),
      start_time: moment(date).format('HH:mm'),
      end_time: moment(date).add(1, 'hour').format('HH:mm'),
      allocated: true,
      all_day: false,
      recurrence: Recurrence.CUSTOM,
      occurrences: [
        {
          id: 0,
          date: moment(date).format('YYYY-MM-DD'),
          start_time: moment(date).format('HH:mm'),
          end_time: moment(date).add(1, 'hour').format('HH:mm'),
          classroom_id: 0,
          classroom: classroom,
        },
      ],
      logs: [],
    },
  };
}
