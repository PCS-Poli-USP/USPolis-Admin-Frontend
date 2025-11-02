/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from '../errorParser';

export class UserErrorParser extends ErrorParser {
  constructor() {
    super('Usuário');
  }

  parseGetSelfError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao carregar suas informações: ${detail}`;
  }

  parseUpdateEmailNotificationsError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao atualizar notificações por e-mail: ${detail}`;
  }
}
