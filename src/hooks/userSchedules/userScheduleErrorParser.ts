/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from '../errorParser';

export class UserScheduleErrorParser extends ErrorParser {
  constructor() {
    super('Grade Horária');
  }

  parseGetMyScheduleError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao carregar sua grade horária: ${detail}`;
  }

  parseCrawlUserScheduleError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao importar grade horária: ${detail}`;
  }
}
