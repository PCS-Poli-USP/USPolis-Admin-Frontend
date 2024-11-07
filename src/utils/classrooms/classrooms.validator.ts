import CommonValidator from 'utils/common/common.validator';

export class ClassroomValidator extends CommonValidator {
  static isInvalidName(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidCapacity(value: number) {
    return value < 0;
  }

  static isInvalidFloor(value: number) {
    return value < 0;
  }
}
