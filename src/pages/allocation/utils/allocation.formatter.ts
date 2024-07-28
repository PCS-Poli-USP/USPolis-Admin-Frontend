import { Recurrence } from 'utils/enums/recurrence.enum';
import { EventExtendedProps } from '../interfaces/allocation.interfaces';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export function getEventScheduleText(extendedProps: EventExtendedProps) {
  const data = extendedProps.class_data || extendedProps.reservation_data;
  if (data) {
    if (data.recurrence === Recurrence.CUSTOM)
      return `${Recurrence.translate(data.recurrence)}`;
    else if (data.recurrence === Recurrence.DAILY) {
      return `${Recurrence.translate(data.recurrence)}`;
    } else if (data.recurrence === Recurrence.MONTHLY) {
      return `${Recurrence.translate(data.recurrence)}, 
      na ${data.month_week ? MonthWeek.toOrdinal(data.month_week) : ''} ${
        data.week_day ? WeekDay.translate(data.week_day) : ''
      }`;
    } else {
      return `${Recurrence.translate(data.recurrence)}, às ${
        data.week_day !== undefined ? WeekDay.translate(data.week_day) : ''
      }s`;
    }
  }
  return '';
}
