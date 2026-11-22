import { describe, expect, it } from 'vitest';
import { adminAccess, grant, makeAccess } from '../../test/access.fixtures';
import { ClassroomAction } from '../enums/actions.enums';
import {
  belongsTo,
  belongsToAnyBuilding,
  canInBuilding,
  canManageClass,
  canManageSubject,
  canOnBuilding,
  canOnClassroom,
  filterBuildings,
} from './access';

const { READ, UPDATE, ALLOCATE, RESERVE } = ClassroomAction;

// A role-only user: ALLOCATE and RESERVE on classroom 10 of building 1, which
// makes building 1 visible (they belong to it), and UPDATE on building 2.
const roleOnly = makeAccess({
  read: {
    classrooms: grant(10, 20, 21),
    buildings: grant(2),
    visible_buildings: grant(1, 2),
  },
  allocate: { classrooms: grant(10), visible_buildings: grant(1) },
  reserve: { classrooms: grant(10), visible_buildings: grant(1) },
  update: {
    buildings: grant(2),
    classrooms: grant(20, 21),
    visible_buildings: grant(2),
  },
});

describe('without access', () => {
  it('denies everything', () => {
    expect(canOnBuilding(null, READ, 1)).toBe(false);
    expect(canOnClassroom(undefined, READ, 1)).toBe(false);
    expect(belongsToAnyBuilding(null)).toBe(false);
  });
});

describe('an admin', () => {
  it('can do everything', () => {
    const access = adminAccess();
    expect(canOnBuilding(access, UPDATE, 99)).toBe(true);
    expect(canOnClassroom(access, ALLOCATE, 99)).toBe(true);
    expect(belongsToAnyBuilding(access)).toBe(true);
  });
});

describe('a role-only user', () => {
  it('acts on the classroom of the grant only', () => {
    expect(canOnClassroom(roleOnly, ALLOCATE, 10)).toBe(true);
    expect(canOnClassroom(roleOnly, ALLOCATE, 11)).toBe(false);
  });

  it('has nothing on the building of a classroom grant', () => {
    expect(canOnBuilding(roleOnly, RESERVE, 1)).toBe(false);
    expect(canInBuilding(roleOnly, RESERVE, 1)).toBe(true);
  });

  it('belongs to the buildings it reads something in', () => {
    expect(belongsTo(roleOnly, 1)).toBe(true);
    expect(belongsTo(roleOnly, 3)).toBe(false);
    expect(belongsToAnyBuilding(roleOnly)).toBe(true);
  });

  it('filters buildings by action', () => {
    const buildings = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(filterBuildings(roleOnly, ALLOCATE, buildings)).toEqual([{ id: 1 }]);
    expect(filterBuildings(roleOnly, READ, buildings)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(
      filterBuildings(roleOnly, READ, buildings, { onBuilding: true }),
    ).toEqual([{ id: 2 }]);
  });

  it('honors a wildcard (all)', () => {
    const access = makeAccess({ read: { classrooms: { all: true, ids: [] } } });
    expect(canOnClassroom(access, READ, 12345)).toBe(true);
  });
});

describe('canManageSubject', () => {
  it('needs the action on one of the subject buildings', () => {
    expect(canManageSubject(roleOnly, [2, 3])).toBe(true);
    expect(canManageSubject(roleOnly, [1, 3])).toBe(false);
  });
});

describe('canManageClass', () => {
  it('follows the classroom of an allocated schedule', () => {
    const cls = {
      schedules: [{ classroom_id: 20 }],
      subject_building_ids: [1],
    };
    expect(canManageClass(roleOnly, cls)).toBe(true);
  });

  it('refuses a class allocated elsewhere, even with the subject building', () => {
    const cls = {
      schedules: [{ classroom_id: 30 }],
      subject_building_ids: [2],
    };
    expect(canManageClass(roleOnly, cls)).toBe(false);
  });

  it('uses the subject buildings for a schedule with no classroom', () => {
    const unallocated = {
      schedules: [{ classroom_id: null }],
      subject_building_ids: [2],
    };
    expect(canManageClass(roleOnly, unallocated)).toBe(true);
    expect(
      canManageClass(roleOnly, { ...unallocated, subject_building_ids: [1] }),
    ).toBe(false);
  });
});
