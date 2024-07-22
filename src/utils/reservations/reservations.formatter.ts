import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export function getReservationRecurrenceText(reservation: ReservationResponse) {
  const schedule = reservation.schedule;
  if (schedule.recurrence === Recurrence.CUSTOM)
    return `${Recurrence.translate(schedule.recurrence)}, ${
      schedule.occurrences ? `${schedule.occurrences.length} datas` : ''
    }`;
  else if (schedule.recurrence === Recurrence.DAILY) {
    return `${Recurrence.translate(schedule.recurrence)}`;
  } else if (schedule.recurrence === Recurrence.MONTHLY) {
    return `${Recurrence.translate(
      schedule.recurrence,
    )}, na ${MonthWeek.translate(
      schedule.month_week as MonthWeek,
    )} ${WeekDay.translate(schedule.week_day as WeekDay)}`;
  } else {
    return `${Recurrence.translate(
      schedule.recurrence,
    )}, às ${WeekDay.translate(schedule.week_day as WeekDay)}s`;
  }
}
