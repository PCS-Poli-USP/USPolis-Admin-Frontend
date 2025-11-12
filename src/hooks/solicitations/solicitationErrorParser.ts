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

  parseDenyError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao negar ${this.model_name}: ${detail}`;
  }

  parseApproveError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao aprovar ${this.model_name}: ${detail}`;
  }
}
