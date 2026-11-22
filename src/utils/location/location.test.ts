import { describe, expect, it } from 'vitest';
import { isAdminRoute } from '.';

describe('isAdminRoute', () => {
  it('matches the admin hub and its pages', () => {
    expect(isAdminRoute('/admin')).toBe(true);
    expect(isAdminRoute('/admin/users')).toBe(true);
    expect(isAdminRoute('/admin/institutional-events')).toBe(true);
  });

  it('does not match other routes', () => {
    expect(isAdminRoute('/oferings/classrooms')).toBe(false);
    expect(isAdminRoute('/public/allocations')).toBe(false);
    expect(isAdminRoute('/administration')).toBe(false);
  });
});
