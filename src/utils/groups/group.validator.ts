import CommonValidator from 'utils/common/common.validator';

export default class GroupValidator extends CommonValidator {
  static isInvalidName(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidAbbreviation(value: string) {
    return value.length < 3 || value.length > 10;
  }

  static isInvalidClassroomIds(values: number[]) {
    return this.isInvalidIdArray(values);
  }

  static isInvalidUserIds(values: number[]) {
    return this.isInvalidIdArray(values);
  }
}
