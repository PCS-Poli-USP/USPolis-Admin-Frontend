/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from '../errorParser';

export class ScheduleErrorParser extends ErrorParser {
  constructor() {
    super('Agenda');
  }

  parseAllocateError(error: any): string {
    const detail = this.getDetailFromError(error);
    return `Erro ao buscar ${this.model_name}: ${detail}`;
  }
}
