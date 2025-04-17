import CommonValidator from "../../utils/common/common.validator";

export default class HolidayCategoryValidator extends CommonValidator {
  static isInvalidName(name: string): boolean {
    return this.isEmptyString(name);
  }
}
