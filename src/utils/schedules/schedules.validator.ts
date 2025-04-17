import CommonValidator from '../../utils/common/common.validator';
import { MonthWeek } from '../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../utils/enums/recurrence.enum';
import { WeekDay } from '../../utils/enums/weekDays.enum';

export class ScheduleValidator extends CommonValidator {
  static isInvalidWeekDay(value: number) {
    return !WeekDay.getValues().includes(value as WeekDay);
  }

  static isInvalidMonthWeek(value: number) {
    return !MonthWeek.getValues().includes(value as MonthWeek);
  }

  static isInvalidRecurrence(value: string) {
    return !Recurrence.getValues().includes(value as Recurrence);
  }

  static isInvalidWeekDayArray(values: number[]) {
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
