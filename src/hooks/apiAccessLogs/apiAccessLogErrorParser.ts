import { ErrorParser } from '../errorParser';

class ApiAccessLogErrorParser extends ErrorParser {
  constructor() {
    super('log de acesso');
  }
}

export default ApiAccessLogErrorParser;
