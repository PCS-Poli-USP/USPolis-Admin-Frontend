import moment from 'moment';
import { AudiovisualType } from '../enums/audiovisualType.enum';

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

  static isNegativeNumber(value: number) {
    return value < 0;
  }

  static isPositiveNumber(value: number) {
    return value > 0;
  }

  static isInvalidDayTime(value: string) {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    const timeRegex2 = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return !timeRegex.test(value) && !timeRegex2.test(value);
  }

  static isValidDayTimes(values: string[]) {
    for (const value of values) {
      if (this.isInvalidDayTime(value)) {
        return false;
      }
    }
    return true;
  }

  static isInvalidDayTimeOfering(start_time: string, end_time: string) {
    const start = moment(start_time, 'HH:mm');
    const end = moment(end_time, 'HH:mm');
    return !start.isSameOrBefore(end);
  }

  static isValidDayTimeOferings(oferings: [string, string][]) {
    for (const [start_time, end_time] of oferings) {
      if (this.isInvalidDayTime(start_time) || this.isInvalidDayTime(end_time))
        return false;
      const start = moment(start_time, 'HH:mm');
      const end = moment(end_time, 'HH:mm');
      if (start.isSameOrAfter(end)) return false;
    }
    return true;
  }

  static isInvalidAudiovisualType(value: string) {
    return !AudiovisualType.values().includes(value as AudiovisualType);
  }

  static isValidURL(value: string) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return false;
      const regex =
        /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
      return regex.test(url.hostname);
    } catch (_) {
      return false;
    }
  }
}
