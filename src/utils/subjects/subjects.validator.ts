export default class SubjectValidator {
  static isEmpty(value: string): boolean {
    return value.length <= 0;
  }

  static isInvalidCode(code: string): boolean {
    return code.length !== 7;
  }

  static isInvalidName(name: string): boolean {
    return this.isEmpty(name);
  }

  static isInvalidProfessor(professor: string): boolean {
    return professor.length < 3;
  }

  static isInvalidProfessorList(professors: string[]): boolean {
    return professors.length <= 0;
  }

  static isInvalidType(type: string): boolean {
    return this.isEmpty(type);
  }

  static isInvalidCredit(class_credit: number, work_credit: number): boolean {
    return class_credit <= 0 || work_credit < 0;
  }

  static isInvalidDate(date: string): boolean {
    return this.isEmpty(date);
  }
}
