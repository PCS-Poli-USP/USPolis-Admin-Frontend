/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosErrorResponse } from '../models/http/responses/common.response.models';

export class ErrorParser {
  protected errors: AxiosErrorResponse[];
  protected model_name: string;

  constructor(model_name: string) {
    this.errors = [];
    this.model_name = model_name;
  }

  addError(error: AxiosErrorResponse) {
    this.errors.push(error);
  }

  getErrors() {
    return this.errors;
  }

  isAxiosErrorResponse(error: any): error is AxiosErrorResponse {
    return error.isAxiosError && error.response !== undefined;
  }

  getDetailFromError(error: any): string {
    if (this.isAxiosErrorResponse(error)) {
      return error.response ? error.response.data.detail : 'Erro inesperado';
    }
    return 'Erro inesperado';
  }

  parseGetError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao buscar ${this.model_name}: ${detail}`;
  }

  parseCreateError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao criar ${this.model_name}: ${detail}`;
  }

  parseUpdateError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao atualizar ${this.model_name}: ${detail}`;
  }

  parseDeleteError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao deletar ${this.model_name}: ${detail}`;
  }
}
