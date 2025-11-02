import { ReservationValidator } from '../reservations/resevations.validator';

export class ExamValidator extends ReservationValidator {
  static isInvalidLabels(values: string[]) {
    values.forEach((value) => {
      if (this.isEmptyString(value)) return true;
    });
    return false;
  }
}
