import { ReservationResponse } from '../../../models/http/responses/reservation.response.models';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import {
  ReservationStatus,
  ReservationType,
} from '../../../utils/enums/reservations.enum';
import moment from 'moment';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { RecurrenceRule } from '../../../models/http/responses/allocation.response.models';
import { ScheduleResponse } from '../../../models/http/responses/schedule.response.models';
import { WeekDay } from '../../../utils/enums/weekDays.enum';

export function scheduleToRRule(schedule: ScheduleResponse): RecurrenceRule {
  const byweekday: string[] = [];
  if (schedule.week_day !== undefined)
    byweekday.push(WeekDay.toRRule(schedule.week_day));
  if (schedule.recurrence === Recurrence.DAILY)
    byweekday.push('MO', 'TH', 'WE', 'TU', 'FR');

  return {
    dtstart: `${schedule.start_date}T${schedule.start_time}`,
    until: `${schedule.end_date}T${schedule.end_time}`,
    freq: Recurrence.toRRule(schedule.recurrence),
    interval: Recurrence.toRRuleInterval(schedule.recurrence),
    byweekday: byweekday,
    bysetpos: schedule.month_week ? schedule.month_week : undefined,
  };
}

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
    type: ReservationType.EVENT,
    status: ReservationStatus.PENDING,
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
      last_log: undefined,
    },
  };
}
