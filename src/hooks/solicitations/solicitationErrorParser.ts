/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from '../errorParser';

export class SolicitationErrorParser extends ErrorParser {
  constructor() {
    super('Solicitação');
  }

  parseCancelError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao cancelar ${this.model_name}: ${detail}`;
  }
}
