const BASE_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT.replace(
  /\/api\/?$/,
  '',
);

export function getWsUrl(path: string): string {
  return `${BASE_URL.replace(/^http/, 'ws')}${path}`;
}
