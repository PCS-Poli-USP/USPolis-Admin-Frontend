import { describe, expect, it } from 'vitest';
import { BaseAction, ClassroomAction, PermissionAction } from './actions.enums';

describe('PermissionAction.implied (same as the backend IMPLIED_ACTIONS)', () => {
  it('every action implies read', () => {
    for (const action of [
      BaseAction.CREATE,
      BaseAction.UPDATE,
      ClassroomAction.ALLOCATE,
      ClassroomAction.RESERVE,
      ClassroomAction.REQUEST,
    ]) {
      expect(PermissionAction.implied(action)).toContain(BaseAction.READ);
    }
  });

  it('delete implies update and read', () => {
    expect(PermissionAction.implied(BaseAction.DELETE)).toEqual([
      BaseAction.UPDATE,
      BaseAction.READ,
    ]);
  });

  it('read implies nothing', () => {
    expect(PermissionAction.implied(BaseAction.READ)).toEqual([]);
  });
});

describe('PermissionAction.withImplied', () => {
  it('adds the implied actions once', () => {
    expect(
      PermissionAction.withImplied([
        BaseAction.DELETE,
        ClassroomAction.RESERVE,
      ]),
    ).toEqual([
      BaseAction.DELETE,
      ClassroomAction.RESERVE,
      BaseAction.UPDATE,
      BaseAction.READ,
    ]);
  });
});

describe('PermissionAction.impliedBy', () => {
  it('names the selected action that implies it', () => {
    const selected = [BaseAction.DELETE, BaseAction.UPDATE, BaseAction.READ];
    expect(PermissionAction.impliedBy(BaseAction.UPDATE, selected)).toBe(
      BaseAction.DELETE,
    );
    expect(PermissionAction.impliedBy(BaseAction.DELETE, selected)).toBe(
      undefined,
    );
  });
});
