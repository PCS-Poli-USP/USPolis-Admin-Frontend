import moment from 'moment';
import { HolidaysTypes } from 'utils/enums/holidays.enums';

export class HolidayValidator {
  static isInvalidCategoryId(category_id: string) {
    return category_id.length === 0;
  }

  static isInvalidDate(date: string) {
    return !moment(date).isValid();
  }

  static isInvalidType(type: string) {
    return !Object.values(HolidaysTypes).includes(type as any);
  }
}
