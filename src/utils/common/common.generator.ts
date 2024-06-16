import moment, { Moment } from 'moment';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

const DATE_FORMATER = 'YYYY-MM-DD';

function generateSteppedDates(start: Moment, end: Moment, step: number) {
  const dates: string[] = [];
  while (start.isSameOrBefore(end)) {
    dates.push(start.format(DATE_FORMATER));
    start.add(step, 'weeks');
  }
  return dates;
}

function generateDailyDates(start: string, end: string) {
  const startDate = moment(start, DATE_FORMATER);
  const endDate = moment(end, DATE_FORMATER);
  const dates: string[] = [];

  const actualDate = startDate.clone();
  while (actualDate.isSameOrBefore(endDate)) {
    if (actualDate.day() !== 6 && actualDate.day() !== 0) {
      dates.push(actualDate.format(DATE_FORMATER));
    }
    actualDate.add(1, 'days');
  }
  return dates;
}

function generateWeeklyDates(start: string, end: string, week_day: WeekDay) {
  const startDate = moment(start, DATE_FORMATER);
  const endDate = moment(end, DATE_FORMATER);

  const actualDate = startDate.clone().day(WeekDay.toInt(week_day));
  if (actualDate.isBefore(startDate)) {
    actualDate.add(1, 'weeks');
  }
  return generateSteppedDates(actualDate, endDate, 1);
}

function generateBiweeklyDates(start: string, end: string, week_day: WeekDay) {
  const startDate = moment(start, DATE_FORMATER);
  const endDate = moment(end, DATE_FORMATER);

  const actualDate = startDate.clone().day(WeekDay.toInt(week_day));
  if (actualDate.isBefore(startDate)) {
    actualDate.add(2, 'weeks');
  }
  return generateSteppedDates(actualDate, endDate, 2);
}

function generateMonthlyDates(start: string, end: string, week_day: WeekDay) {
  const startDate = moment(start, DATE_FORMATER);
  const endDate = moment(end, DATE_FORMATER);

  const actualDate = startDate.clone().day(WeekDay.toInt(week_day));
  if (actualDate.isBefore(startDate)) {
    actualDate.add(1, 'months');
  }
  return generateSteppedDates(actualDate, endDate, 4);
}

/**
 *
 * @param {string} start
 * @param {string} end
 * @param {Recurrence} recurrence
 * @param {WeekDay} week_day
 */
export function generateRecurrenceDates(
  start: string,
  end: string,
  recurrence: Recurrence,
  week_day?: WeekDay,
) {
  switch (recurrence) {
    case Recurrence.DAILY:
      return generateDailyDates(start, end);
    case Recurrence.WEEKLY:
      return generateWeeklyDates(start, end, week_day as WeekDay);
    case Recurrence.BIWEEKLY:
      return generateBiweeklyDates(start, end, week_day as WeekDay);
    case Recurrence.MONTHLY:
      return generateMonthlyDates(start, end, week_day as WeekDay);
    default:
      return [];
  }
}
