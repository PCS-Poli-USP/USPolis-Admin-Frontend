import { ScheduleResponse } from '../../models/http/responses/schedule.response.models';
import moment from 'moment';
import { ScheduleData } from '../../pages/classes/ClassModal/class.modal.interface';
import { MonthWeek } from '../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../utils/enums/recurrence.enum';
import { WeekDay } from '../../utils/enums/weekDays.enum';

export function getScheduleFullString(
  schedule: ScheduleData | ScheduleResponse,
) {
  const recurrenceString = getScheduleString(schedule);
  return `${recurrenceString}  (${schedule.start_time.substring(
    0,
    5,
  )} ~ ${schedule.end_time.substring(0, 5)}) de ${moment(
    schedule.start_date,
  ).format('DD/MM/YYYY')} até ${moment(schedule.end_date).format(
    'DD/MM/YYYY',
  )}`;
}

export function getScheduleWithTimeString(
  schedule: ScheduleData | ScheduleResponse,
) {
  const recurrenceString = getScheduleString(schedule);
  return `${recurrenceString} das ${schedule.start_time.substring(
    0,
    5,
  )} até ${schedule.end_time.substring(0, 5)}`;
}

export function getScheduleWithDateString(
  schedule: ScheduleData | ScheduleResponse,
) {
  const recurrenceString = getScheduleString(schedule);
  return `${recurrenceString} de ${moment(schedule.start_date).format(
    'DD/MM/YYYY',
  )} até ${moment(schedule.end_date).format('DD/MM/YYYY')}`;
}

export function getScheduleString(schedule: ScheduleData | ScheduleResponse) {
  if (schedule.recurrence === Recurrence.CUSTOM) {
    if ('dates' in schedule)
      return `${Recurrence.translate(schedule.recurrence)} ${
        schedule.dates ? `${schedule.dates.length} datas` : ''
      }`;

    if ('occurrences' in schedule)
      return `${Recurrence.translate(schedule.recurrence)} ${
        schedule.occurrences ? `${schedule.occurrences.length} datas` : ''
      }`;
    return 'Agenda no formato inválido';
  } else if (schedule.recurrence === Recurrence.DAILY) {
    return `${Recurrence.translate(schedule.recurrence)}`;
  } else if (schedule.recurrence === Recurrence.MONTHLY) {
    return `${Recurrence.translate(
      schedule.recurrence,
    )} na ${MonthWeek.toOrdinal(
      schedule.month_week as MonthWeek,
    )} ${WeekDay.translate(schedule.week_day as WeekDay)}`;
  } else {
    return `${Recurrence.translate(schedule.recurrence)} às ${WeekDay.translate(
      schedule.week_day as WeekDay,
    )}s`;
  }
}

export function getScheduleTime(schedule: ScheduleData | ScheduleResponse) {
  return `${
    schedule.week_day !== undefined ? WeekDay.translate(schedule.week_day) : ''
  } ${schedule.start_time.substring(0, 5)} até ${schedule.end_time.substring(
    0,
    5,
  )}`;
}
