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

  static isInvalidDate(date: string) {
    return !moment(date).isValid();
  }
}
