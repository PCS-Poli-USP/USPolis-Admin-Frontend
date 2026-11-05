import moment from 'moment';

// Mirrors the backend rules in server/services/security/api_key_scope.py and
// server/models/http/requests/api_key_request_models.py.

export const MAX_KEY_LIFETIME_DAYS = 365;

export function prefixError(prefix: string): string {
  if (!prefix) return 'Informe um prefixo.';
  if (!prefix.startsWith('/')) return 'O prefixo deve começar com “/”.';
  if (prefix !== '/' && prefix.endsWith('/'))
    return 'O prefixo não pode terminar com “/”.';
  if (
    prefix.includes('//') ||
    prefix.split('/').some((part) => part === '.' || part === '..')
  )
    return 'O prefixo contém segmentos inválidos.';
  if (/[?#*%\\\s]/.test(prefix))
    return 'O prefixo não pode conter espaços nem os caracteres ? # * % \\.';
  return '';
}

export function daysUntil(date: string): number {
  return moment(date, 'YYYY-MM-DD')
    .startOf('day')
    .diff(moment().startOf('day'), 'days');
}

export function expiryError(date: string): string {
  if (!date || !moment(date, 'YYYY-MM-DD', true).isValid())
    return 'Informe a data de validade.';
  const days = daysUntil(date);
  if (days < 1) return 'A validade deve ser uma data no futuro.';
  if (days > MAX_KEY_LIFETIME_DAYS)
    return 'A validade máxima é de 365 dias a partir de hoje.';
  return '';
}

export function rateLimitsError(
  rules: { max_requests: number; window_seconds: number }[],
): string {
  if (!rules.length)
    return 'Adicione ao menos uma regra ou use os limites padrão.';
  if (rules.some((rule) => !(Number(rule.max_requests) >= 1)))
    return 'O número de requisições deve ser maior que zero.';
  const windows = rules.map((rule) => Number(rule.window_seconds));
  if (new Set(windows).size !== windows.length)
    return 'Cada janela só pode aparecer uma vez.';
  return '';
}
