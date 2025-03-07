import { AxiosErrorResponse } from 'models/http/responses/common.response.models';

export class ErrorParser {
  private errors: AxiosErrorResponse[];

  constructor() {
    this.errors = [];
  }

  addError(error: AxiosErrorResponse) {
    this.errors.push(error);
  }

  getErrors() {
    return this.errors;
  }

  static isAxiosErrorResponse(error: any): error is AxiosErrorResponse {
    return error.isAxiosError && error.response !== undefined;
  }

  static getDetailFromError(error: any): string {
    if (this.isAxiosErrorResponse(error)) {
      return error.response ? error.response.data.detail : 'Erro inesperado';
    }
    return 'Erro inesperado';
  }
}
