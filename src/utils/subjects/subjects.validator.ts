import CommonValidator from 'utils/common/common.validator';
import { SubjectsTypes } from 'utils/enums/subjects.enum';

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
    if (this.isEmptyArray(professors)) return true;
    professors.forEach((professor) => {
      if (this.isInvalidProfessor(professor)) return true;
    });
    return false;
  }

  static isInvalidType(value: string): boolean {
    return Object.values(SubjectsTypes).includes(value as SubjectsTypes);
  }

  static isInvalidCredit(class_credit: number, work_credit: number): boolean {
    return class_credit <= 0 || work_credit < 0;
  }
}
