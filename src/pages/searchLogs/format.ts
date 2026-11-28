export function formatCount(value: number): string {
  return value.toLocaleString('pt-BR');
}

// 0.256 -> "26%"; null (nothing to divide by) -> "—"
export function formatShare(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

export function share(part: number, whole: number): number | null {
  return whole > 0 ? part / whole : null;
}
