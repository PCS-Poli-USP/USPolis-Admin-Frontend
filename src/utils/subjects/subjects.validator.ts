import CommonValidator from 'utils/common/common.validator';
import { SubjectType } from 'utils/enums/subjects.enum';

export default class SubjectValidator extends CommonValidator {
  static isInvalidCode(value: string): boolean {
    return value.length !== 7;
  }

  static isInvalidName(value: string): boolean {
    return this.isEmptyString(value);
  }

  static isInvalidProfessor(value: string): boolean {
    return value.length < 3;
  }

  static isInvalidProfessorList(professors: string[]): boolean {
    if (this.isEmptyArray(professors)) return false;
    professors.forEach((professor) => {
      if (this.isInvalidProfessor(professor)) return true;
    });
    return false;
  }

  static isInvalidType(value: string): boolean {
    return !Object.values(SubjectType).includes(value as SubjectType);
  }

  static isInvalidCredit(value: number): boolean {
    return value < 0;
  }
}
