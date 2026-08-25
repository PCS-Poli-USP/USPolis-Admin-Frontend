export function statusCodeColorScheme(code: number): string {
  if (code >= 500) return 'red';
  if (code >= 400) return 'yellow';
  return 'gray';
}

export function formatLogDateTime(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}
