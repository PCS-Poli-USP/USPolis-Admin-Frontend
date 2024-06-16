import moment from 'moment';
import CommonValidator from 'utils/common/common.validator';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export class ScheduleValidator extends CommonValidator {
  static isInvalidWeekDay(value: string) {
    return !WeekDay.getValues().includes(value as WeekDay);
  }

  static isInvalidDayTime(value: string) {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return !timeRegex.test(value);
  }

  static isInvalidDayTimeOfering(start_time: string, end_time: string) {
    const start = moment(start_time, 'HH:mm');
    const end = moment(end_time, 'HH:mm');
    return !start.isSameOrBefore(end);
  }

  static isInvalidRecurrence(value: string) {
    return !Recurrence.getValues().includes(value as Recurrence);
  }

  static isInvalidWeekDayArray(values: string[]) {
    values.forEach((value) => {
      if (this.isInvalidWeekDay(value)) return true;
    });
    return false;
  }

  static isInvalidDayTimeArray(values: string[]) {
    values.forEach((value) => {
      if (this.isInvalidDayTime(value)) return true;
    });
    return false;
  }
}
