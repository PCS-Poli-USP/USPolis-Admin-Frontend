import moment from 'moment';
export class HolidayValidator {
  static isInvalidCategoryId(category_id: number) {
    return category_id <= 0;
  }

  static isInvalidDate(date: string) {
    return !moment(date).isValid();
  }
}
