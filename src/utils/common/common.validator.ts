export class CommonValidator {
  static isInvalidId(id: number) {
    return id <= 0;
  }

  static isEmptyString(value: string) {
    return value.length === 0;
  }

  static isEmptyArray(values: any[]) {
    return values.length === 0;
  }
}
