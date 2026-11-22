// Every admin page lives under /admin (see AppRoutes.tsx).
export const adminRoutePrefix = '/admin';

export function isAdminRoute(pathname: string): boolean {
  return (
    pathname === adminRoutePrefix || pathname.startsWith(adminRoutePrefix + '/')
  );
}
