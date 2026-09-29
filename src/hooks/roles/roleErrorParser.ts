import { ErrorParser } from '../errorParser';

class RoleErrorParser extends ErrorParser {
  constructor() {
    super('Papel');
  }

  parseAddUserError(error: unknown) {
    const detail = this.getDetailFromError(error);
    return `Erro ao adicionar usuário ao papel: ${detail}`;
  }

  parseRemoveUserError(error: unknown) {
    const detail = this.getDetailFromError(error);
    return `Erro ao remover usuário do papel: ${detail}`;
  }
}

export default RoleErrorParser;
