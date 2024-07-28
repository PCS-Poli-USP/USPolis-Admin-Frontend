import CommonValidator from 'utils/common/common.validator';

export class ReservationValidator extends CommonValidator {
  static isInvalidName(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidType(value: string) {
    return this.isEmptyString(value);
  }
}
