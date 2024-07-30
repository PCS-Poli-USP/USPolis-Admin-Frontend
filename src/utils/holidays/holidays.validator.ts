import CommonValidator from 'utils/common/common.validator';
export class HolidayValidator extends CommonValidator {
  static isInvalidCategoryId(category_id: number) {
    return this.isInvalidId(category_id);
  }

  static isInvalidName(value: string) {
    return this.isEmptyString(value);
  }
}
