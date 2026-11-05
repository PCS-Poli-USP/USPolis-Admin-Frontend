import moment from 'moment';
import { RateLimitResponse } from '../../models/http/responses/apiKey.response.models';
import { MAX_KEY_LIFETIME_DAYS, daysUntil } from './apiKeys.validator';

// Public route prefixes offered as one-click suggestions in the scope picker.
export const SUGGESTED_PREFIXES = [
  '/allocations',
  '/buildings',
  '/classrooms',
  '/classes',
  '/reservations',
  '/subjects',
];

export const RATE_LIMIT_WINDOWS = [
  { value: 1, label: 'por segundo', short: '/s' },
  { value: 10, label: 'a cada 10 segundos', short: '/10 s' },
  { value: 60, label: 'por minuto', short: '/min' },
  { value: 3600, label: 'por hora', short: '/h' },
  { value: 86400, label: 'por dia', short: '/dia' },
];

// Shown before a key exists. Mirrors the backend defaults of
// API_KEY_DEFAULT_LIMITS (server/config.py); once a key exists, the limits
// come from the API response instead.
export const DEFAULT_LIMITS: RateLimitResponse[] = [
  { max_requests: 30, window_seconds: 10 },
  { max_requests: 120, window_seconds: 60 },
  { max_requests: 10000, window_seconds: 86400 },
];

const ENVIRONMENTS: Record<string, string> = {
  live: 'Produção (live)',
  test: 'Staging (test)',
  dev: 'Desenvolvimento (dev)',
};

export function formatDateTime(value: string | null | undefined): string {
  return value ? moment(value).format('DD/MM/YYYY HH:mm') : '—';
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

function windowOf(seconds: number) {
  return RATE_LIMIT_WINDOWS.find((w) => w.value === seconds);
}

export function limitsShort(rules: RateLimitResponse[]): string {
  return rules
    .map(
      (r) =>
        `${formatNumber(r.max_requests)}${windowOf(r.window_seconds)?.short ?? `/${r.window_seconds} s`}`,
    )
    .join(' · ');
}

export function limitsLong(rules: RateLimitResponse[]): string {
  return rules
    .map(
      (r) =>
        `${formatNumber(r.max_requests)} ${windowOf(r.window_seconds)?.label ?? `a cada ${r.window_seconds} s`}`,
    )
    .join(' · ');
}

export function windowLabel(seconds: number): string {
  return windowOf(seconds)?.label ?? `a cada ${seconds} s`;
}

export function environmentLabel(maskedKey: string): string {
  const env = maskedKey.split('_')[1];
  return ENVIRONMENTS[env] ?? env;
}

export function dateInputValue(value: moment.MomentInput): string {
  return moment(value).format('YYYY-MM-DD');
}

export function dateInputBounds() {
  return {
    min: moment().add(1, 'day').format('YYYY-MM-DD'),
    max: moment().add(MAX_KEY_LIFETIME_DAYS, 'days').format('YYYY-MM-DD'),
  };
}

// The key stays valid until the end of the chosen day, capped just under the
// backend's 365-day limit (counted from now, not from midnight). Sent as naive
// local time, which the backend stores as Brazil time.
export function expiresAtRequest(date: string): string {
  const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day');
  const limit = moment()
    .add(MAX_KEY_LIFETIME_DAYS, 'days')
    .subtract(5, 'minutes');
  return moment.min(endOfDay, limit).format('YYYY-MM-DDTHH:mm:ss');
}

export function plural(n: number, singular: string, pluralForm: string) {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}

export function expiryNote(expiresAt: string): {
  text: string;
  warn: boolean;
} {
  const days = daysUntil(dateInputValue(expiresAt));
  if (moment(expiresAt).isBefore(moment()))
    return {
      text: `expirou há ${plural(Math.max(-days, 0), 'dia', 'dias')}`,
      warn: false,
    };
  if (days < 30)
    return { text: `expira em ${plural(days, 'dia', 'dias')}`, warn: true };
  return { text: `expira em ${days} dias`, warn: false };
}
