import { CommonValidator } from 'utils/common/common.validator';

export default class DepartmentValidator extends CommonValidator {
  static isInvalidName(value: string) {
    return value.length === 0;
  }

  static isInvalidAbbreviation(value: string) {
    return value.length !== 3;
  }
}
