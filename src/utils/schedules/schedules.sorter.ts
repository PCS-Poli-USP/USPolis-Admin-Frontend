import moment from 'moment';
import { ScheduleResponseBase } from '../../models/http/responses/schedule.response.models';
import { Recurrence } from '../../utils/enums/recurrence.enum';

export function sortScheduleResponse(
  A: ScheduleResponseBase,
  B: ScheduleResponseBase,
) {
  if (A.week_day === undefined && B.week_day === undefined) {
    // Sort by recurrence
    const recurA = Recurrence.toInt(A.recurrence);
    const recurB = Recurrence.toInt(B.recurrence);
    if (recurA < recurB) return -1;
    if (recurA > recurB) return 1;

    // Sort by time
    return sortScheduleByTime(A, B);
  }
  if (A.week_day === undefined && B.week_day) return 1;
  if (A.week_day && B.week_day === undefined) return -1;

  if (A.week_day !== undefined && B.week_day !== undefined) {
    if (A.week_day < B.week_day) return -1;
    if (A.week_day < B.week_day) return 1;

    const recurA = Recurrence.toInt(A.recurrence);
    const recurB = Recurrence.toInt(B.recurrence);
    if (recurA < recurB) return -1;
    if (recurA > recurB) return 1;

    return sortScheduleByTime(A, B);
  }
  return 0;
}

const TIME_FORMAT = 'HH:mm:ss';

function sortScheduleByTime(A: ScheduleResponseBase, B: ScheduleResponseBase) {
  const startA = moment(A.start_time, TIME_FORMAT);
  const startB = moment(B.start_time, TIME_FORMAT);
  if (startA.isBefore(startB)) return -1;
  if (startA.isAfter(startB)) return 1;

  const endA = moment(A.end_time, TIME_FORMAT);
  const endB = moment(A.end_time, TIME_FORMAT);
  if (endA.isBefore(endB)) return -1;
  if (endA.isAfter(endA)) return 1;

  return 0;
}
