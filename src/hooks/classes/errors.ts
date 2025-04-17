import { ErrorParser } from '../../hooks/errors';

export class ClassErrorParser extends ErrorParser {
  static parseGetError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao buscar turmas: ${detail}`;
  }

  static parseCreateError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao criar turma: ${detail}`;
  }

  static parseUpdateError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao atualizar turma: ${detail}`;
  }

  static parseDeleteError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao deletar turma: ${detail}`;
  }
}
