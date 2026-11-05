/* eslint-disable @typescript-eslint/no-explicit-any */

// FastAPI returns `detail` as a string for HTTP errors and as a list of
// pydantic issues for 422s (messages prefixed with "Value error, ").
export function apiErrorMessage(error: any, fallback: string): string {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((d) => String(d?.msg ?? '').replace(/^Value error, /, ''))
      .filter(Boolean)
      .join(' ');
  }
  return fallback;
}
