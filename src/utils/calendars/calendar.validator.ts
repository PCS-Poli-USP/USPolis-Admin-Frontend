export class CalendarValidator {
  static isInvalidName(value: string) {
    return value.length === 0;
  }

  static isInvalidCategoriesIds(value: number[]) {
    return value.length === 0 || !!value.find((id) => id <= 0);
  }
}
