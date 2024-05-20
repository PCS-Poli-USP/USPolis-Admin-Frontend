export default class HolidayCategoryValidator {
  static isInvalidName(name: string): boolean {
    return name.length === 0;
  }
}
