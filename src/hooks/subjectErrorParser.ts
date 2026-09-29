/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorParser } from './errorParser';

class SubjectErrorParser extends ErrorParser {
  constructor() {
    super('Disciplina');
  }

  parseCrawlError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao buscar disciplinas no JúpiterWeb: ${detail}`;
  }

  parseUpdateCrawlError(error: any) {
    const detail = this.getDetailFromError(error);
    return `Erro ao atualizar disciplinas pelo JúpiterWeb: ${detail}`;
  }
}

export default SubjectErrorParser;
