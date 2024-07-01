import { Recurrence } from "utils/enums/recurrence.enum";
import { ScheduleData } from "../class.modal.interface";
import moment from "moment";
import { WeekDay } from "utils/enums/weekDays.enum";

export function sortScheduleData(A: ScheduleData, B: ScheduleData) {
  if (A.recurrence < B.recurrence) return -1;
  if (A.recurrence > B.recurrence) return 1;
  return 0;
}

export function scheduleToString(schedule: ScheduleData) {
  if (
    schedule.recurrence === Recurrence.CUSTOM ||
    schedule.recurrence === Recurrence.DAILY
  )
    return `${Recurrence.translate(schedule.recurrence)}, ${schedule.dates ? `${schedule.dates.length} datas` : ''} de ${moment(
      schedule.start_date,
    ).format('DD/MM/YYYY')} até ${moment(schedule.end_date).format(
      'DD/MM/YYYY',
    )} - ${schedule.start_time} ~ ${schedule.end_time}`;
  else {
    return `${Recurrence.translate(
      schedule.recurrence,
    )}, às ${WeekDay.translate(schedule.week_day as WeekDay)}s de ${moment(
      schedule.start_date,
    ).format('DD/MM/YYYY')} até ${moment(schedule.end_date).format(
      'DD/MM/YYYY',
    )} - ${schedule.start_time} ~ ${schedule.end_time}`;
  }
}