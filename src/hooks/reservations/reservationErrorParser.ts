/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from '../errorParser';

class ReservationErrorParser extends ErrorParser {
  constructor() {
    super('Reserva');
  }

  parseUpdateOccurrencesError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao editar ocorrências: ${detail}`;
  }
}

export default ReservationErrorParser;
