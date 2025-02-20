import { ErrorParser } from 'hooks/errors';

export class ClassErrorParser extends ErrorParser {
  static parseCreateError(error: any) {
    if (this.isAxiosErrorResponse(error)) {
      if (error.response?.status === 409) {
        return 'Erro ao criar turma: Código da turma já existe';
      }
      return `Erro ao criar turma: ${error.response?.data.detail}`;
    }
    return 'Erro inesperado ao criar turma';
  }
}
