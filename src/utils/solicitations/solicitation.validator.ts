import CommonValidator from '../../utils/common/common.validator';

export class SolicitationValidator extends CommonValidator {
  static isInvalidReservationType(value: string) {
    return this.isEmptyString(value);
  }

  static isInvalidReason(value: string) {
    return this.isEmptyString(value);
  }
}
