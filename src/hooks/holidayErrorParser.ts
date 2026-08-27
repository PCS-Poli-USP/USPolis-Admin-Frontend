/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from './errorParser';

class HolidayErrorParser extends ErrorParser {
  constructor() {
    super('Feriado');
  }

  parseCreateManyError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao criar feriados: ${detail}`;
  }
}

export default HolidayErrorParser;
