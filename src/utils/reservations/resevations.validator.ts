import CommonValidator from '../../utils/common/common.validator';

export class ReservationValidator extends CommonValidator {
  static isInvalidTitle(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidType(value: string) {
    return this.isEmptyString(value);
  }
}
