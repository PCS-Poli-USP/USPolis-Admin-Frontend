export const adminRoutePrefix = [
  '/users',
  '/groups',
  '/buildings',
  '/bug-reports',
  '/feedbacks',
  '/institutional-events',
];

export function isAdminRoute(pathname: string): boolean {
  return adminRoutePrefix.some((prefix) => pathname.startsWith(prefix));
}
