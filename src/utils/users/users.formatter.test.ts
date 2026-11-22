import { describe, expect, it } from 'vitest';
import { UserResponse } from '../../models/http/responses/user.response.models';
import { BuildingResponse } from '../../models/http/responses/building.response.models';
import { hasElevatedAccess, hasRestrictedAccess } from './users.formatter';
import { grant, makeAccess } from '../../test/access.fixtures';

function makeUser(overrides: Partial<UserResponse> = {}): UserResponse {
  return {
    id: 1,
    email: 'user@usp.br',
    is_admin: false,
    receive_emails: false,
    building_ids: [],
    building_names: [],
    group_ids: [],
    group_names: [],
    solicitations: [],
    groups: [],
    ...overrides,
  } as UserResponse;
}

describe('hasRestrictedAccess', () => {
  it('denies without a user', () => {
    expect(hasRestrictedAccess(null)).toBe(false);
    expect(hasRestrictedAccess(undefined)).toBe(false);
  });

  it('allows an admin', () => {
    expect(hasRestrictedAccess(makeUser({ is_admin: true }))).toBe(true);
  });

  it('allows a user with a building', () => {
    const user = makeUser({ buildings: [{ id: 1 } as BuildingResponse] });
    expect(hasRestrictedAccess(user)).toBe(true);
  });

  it('allows a user with only a role, like the backend gate', () => {
    expect(hasRestrictedAccess(makeUser({ role_ids: [3] }))).toBe(true);
  });

  it('denies a user with no building and no role', () => {
    expect(hasRestrictedAccess(makeUser())).toBe(false);
    expect(hasRestrictedAccess(makeUser({ buildings: [], role_ids: [] }))).toBe(
      false,
    );
  });
});

describe('hasElevatedAccess', () => {
  it('counts a role-only user who belongs to a building', () => {
    const access = makeAccess({ read: { visible_buildings: grant(1) } });
    expect(hasElevatedAccess(makeUser(), access)).toBe(true);
  });

  it('is false without any building, and true for an admin', () => {
    expect(hasElevatedAccess(makeUser(), makeAccess())).toBe(false);
    expect(hasElevatedAccess(makeUser({ is_admin: true }), null)).toBe(true);
  });
});
