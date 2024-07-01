import CommonValidator from 'utils/common/common.validator';
import { ClassType } from 'utils/enums/classes.enum';

export class ClassValidator extends CommonValidator {
  static isInvalidClassCode(value: string) {
    return value.length !== 7;
  }

  static isInvalidSubjectCode(value: string) {
    return value.length !== 7;
  }

  static isInvalidSubjectName(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidOfering(pendings: number, subscribers: number) {
    if (pendings > subscribers) {
      return true;
    }
    return false;
  }

  static isInvalidClassType(value: string) {
    return !Object.values(ClassType).includes(value as ClassType);
  }

  static isInvalidProfessor(value: string) {
    return value.length < 3;
  }

  static isInvalidProfessorList(professors: string[]) {
    if (this.isEmptyArray(professors)) return true;
    professors.forEach((professor) => {
      if (this.isInvalidProfessor(professor)) return true;
    });
    return false;
  }

  static isInvalidSemester(value: number) {
    return value !== 1 && value !== 2;
  }

  static isInvalidPeriod(start: string, end: string) {
    if (start.length === 0 || end.length === 0) return true;
    const startPeriodObj = new Date(start);
    const endPeriodObj = new Date(end);

    if (startPeriodObj <= endPeriodObj) {
      return false;
    }
    return true;
  }

  static isInvalidTime(start_time: string, end_time: string) {
    if (start_time.length === 0 || end_time.length === 0) return true;
    const [startHour, startMinute] = start_time.split(':').map(Number);
    const [endHour, endMinute] = end_time.split(':').map(Number);

    if (
      startHour < endHour ||
      (startHour === endHour && startMinute < endMinute)
    ) {
      return false;
    }
    return true;
  }

  static isInvalidTimeList(
    start_times: string[],
    end_times: string[],
  ): boolean {
    return this.isEmptyArray(start_times) || this.isEmptyArray(end_times);
  }

  static isInvalidWeekDayList(week_days: string[]) {
    return this.isEmptyArray(week_days);
  }

  static isInvalidEditedTimeList(start_times: string[], end_times: string[]) {
    const indexes: number[] = [];
    for (let i = 0; i < start_times.length; i++) {
      if (this.isInvalidTime(start_times[i], end_times[i])) {
        indexes.push(i);
      }
    }
    return indexes;
  }
}
