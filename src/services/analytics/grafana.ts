// USPolis Analytics (Grafana), run by the `analytics` profile of the
// USPolis-Admin compose stack.
//
// In production nginx serves Grafana at /analytics/ on the same domain as the
// app, so the relative default needs no configuration. Dev has no nginx and
// Grafana gets its own port: set VITE_GRAFANA_URL (the compose override does,
// e.g. http://localhost:3030/analytics/). Like every VITE_* value it is baked
// in at build time. With the profile off, the link answers 502.
const BASE_URL = (
  (import.meta.env.VITE_GRAFANA_URL as string | undefined) || '/analytics/'
).replace(/\/*$/, '/');

// uid of analytics/grafana/dashboards/uspolis-api-access.json in USPolis-Admin.
// Grafana sends a signed-out user to its login page and back here.
export const GRAFANA_DASHBOARD_URL = `${BASE_URL}d/uspolis-api-access`;

export function openGrafana(): void {
  window.open(GRAFANA_DASHBOARD_URL, '_blank', 'noopener,noreferrer');
}
