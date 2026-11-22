import { describe, expect, it } from 'vitest';
import { adminAccess, grant, makeAccess } from '../../../test/access.fixtures';
import { ClassroomAction } from '../../../utils/enums/actions.enums';
import { canActAt } from './allocation.utils';

const classrooms = [
  { id: 10, name: 'Sala 1', building: 'Biênio', building_id: 1 },
  { id: 11, name: 'Sala 2', building: 'Biênio', building_id: 1 },
];

const access = makeAccess({
  reserve: { classrooms: grant(10), visible_buildings: grant(1) },
});

describe('canActAt', () => {
  it('books only the classroom of the grant', () => {
    const { RESERVE } = ClassroomAction;
    expect(canActAt(access, RESERVE, classrooms, 'Biênio', 'Sala 1')).toBe(
      true,
    );
    expect(canActAt(access, RESERVE, classrooms, 'Biênio', 'Sala 2')).toBe(
      false,
    );
  });

  it('needs the action on the building itself when there is no classroom', () => {
    expect(
      canActAt(access, ClassroomAction.RESERVE, classrooms, 'Biênio'),
    ).toBe(false);
  });

  it('refuses an unknown place, except for admins', () => {
    const { RESERVE } = ClassroomAction;
    expect(canActAt(access, RESERVE, classrooms, 'Outro', 'Sala 9')).toBe(
      false,
    );
    expect(canActAt(adminAccess(), RESERVE, [], 'Outro', 'Sala 9')).toBe(true);
    expect(canActAt(null, RESERVE, classrooms, 'Biênio', 'Sala 1')).toBe(false);
  });
});
