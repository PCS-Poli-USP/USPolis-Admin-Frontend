import moment, { Moment } from 'moment';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
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

function getWeekdayDateForMonthWeek(
  start_date: string,
  week_day: WeekDay,
  month_week: MonthWeek,
): Moment {
  const firstDate = moment(start_date, DATE_FORMATER).startOf('month');
  const daysGap = (WeekDay.toInt(week_day) - firstDate.day() + 7) % 7; // week_day is not isoWeekday, so we need to use WeekDay.toInt()
  console.log(
    'Teste: ',
    firstDate.day(),
    firstDate.weekday(),
    WeekDay.toInt(week_day),
    firstDate.format(DATE_FORMATER),
    daysGap,
  );
  const firstWeekDayDate = firstDate.clone().add(daysGap, 'days');
  if (month_week === MonthWeek.LAST) {
    const lastWeekDayDate = firstWeekDayDate.clone().add(4, 'weeks');
    if (
      lastWeekDayDate.month() > firstDate.month() ||
      (lastWeekDayDate.month() === 1 && firstDate.month() === 12)
    ) {
      lastWeekDayDate.subtract(1, 'weeks');
    }
    return lastWeekDayDate;
  }
  return firstWeekDayDate.add(month_week - 1, 'weeks');
}

function generateMonthlyDates(
  start: string,
  end: string,
  week_day: WeekDay,
  month_week: MonthWeek,
) {
  if (!month_week) {
    throw Error('Month week is required when recurrence is monthly');
  }

  const startDate = moment(start, DATE_FORMATER);
  const endDate = moment(end, DATE_FORMATER);
  const dates: string[] = [];

  const actualDate = startDate.clone();
  while (actualDate.isSameOrBefore(endDate)) {
    const weekDayDate = getWeekdayDateForMonthWeek(
      actualDate.format(DATE_FORMATER),
      week_day,
      month_week,
    );
    if (
      startDate.isSameOrBefore(weekDayDate) &&
      weekDayDate.isSameOrBefore(endDate)
    ) {
      dates.push(weekDayDate.format(DATE_FORMATER));
    }
    if (actualDate.month() === 12) {
      actualDate.year(actualDate.year() + 1);
      actualDate.month(1);
      actualDate.date(1);
    } else {
      actualDate.month(actualDate.month() + 1);
      actualDate.date(1);
    }
  }

  return dates;
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
  month_week?: MonthWeek,
) {
  switch (recurrence) {
    case Recurrence.DAILY:
      return generateDailyDates(start, end);
    case Recurrence.WEEKLY:
      return generateWeeklyDates(start, end, week_day as WeekDay);
    case Recurrence.BIWEEKLY:
      return generateBiweeklyDates(start, end, week_day as WeekDay);
    case Recurrence.MONTHLY:
      return generateMonthlyDates(
        start,
        end,
        week_day as WeekDay,
        month_week as MonthWeek,
      );
    default:
      return [];
  }
}
