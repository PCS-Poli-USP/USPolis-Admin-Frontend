import { normalizeString } from './formatters';

export function filterStringArray(values: string[], filter: string) {
  return values.some((it) =>
    normalizeString(it).includes(normalizeString(filter)),
  );
}

export function filterString(value: string, filter: string) {
  return normalizeString(value).includes(normalizeString(filter));
}
