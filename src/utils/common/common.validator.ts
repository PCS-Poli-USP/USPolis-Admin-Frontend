import moment from 'moment';

export default class CommonValidator {
  static isEmptyString(value: string) {
    return value.length === 0;
  }

  static isEmptyArray(value: any[]) {
    return value.length === 0;
  }

  static isInvalidId(value: number) {
    return value <= 0;
  }

  static isInvalidIdArray(values: number[]) {
    if (this.isEmptyArray(values)) return true;
    values.forEach((id) => {
      if (this.isInvalidId(id)) {
        return true;
      }
    });
    return false;
  }

  static isInvalidDate(date: string) {
    return !moment(date).isValid();
  }

  static isInvalidDateOferring(start_date: string, end_date: string) {
    const start = moment(start_date, 'YYYY:MM:DD');
    const end = moment(end_date, 'YYYY:MM:DD');
    return !start.isSameOrBefore(end);
  }
}
