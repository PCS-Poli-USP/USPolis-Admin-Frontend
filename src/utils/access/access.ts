import {
  AccessGrant,
  UserAccessResponse,
} from '../../models/http/responses/access.response.models';
import { ClassroomAction } from '../enums/actions.enums';

// Reads the access the backend resolved (GET /users/my-access, in
// AppContext.access). These functions only look the answer up: the rules
// themselves (implied actions, building -> classroom cascade, wildcards,
// legacy groups) are applied by the backend, see the developer reference
// "Backend › Regras de permissão". Never decide access from
// `loggedUser.buildings` or `loggedUser.groups`.

type Access = UserAccessResponse | null | undefined;

/** Every action a building or classroom grant can carry. */
export type AccessAction = ClassroomAction;

function grantHas(grant: AccessGrant | undefined, id: number): boolean {
  if (!grant) return false;
  return grant.all || grant.ids.includes(id);
}

function scopeOf(access: Access, action: AccessAction) {
  return access ? access.scopes[action] : undefined;
}

/** The action on the building itself. */
export function canOnBuilding(
  access: Access,
  action: AccessAction,
  buildingId: number,
): boolean {
  if (!access) return false;
  if (access.is_admin) return true;
  return grantHas(scopeOf(access, action)?.buildings, buildingId);
}

/** The action on the classroom (directly or through its building). */
export function canOnClassroom(
  access: Access,
  action: AccessAction,
  classroomId: number,
): boolean {
  if (!access) return false;
  if (access.is_admin) return true;
  return grantHas(scopeOf(access, action)?.classrooms, classroomId);
}

/** The action on the building or on at least one of its classrooms. */
export function canInBuilding(
  access: Access,
  action: AccessAction,
  buildingId: number,
): boolean {
  if (!access) return false;
  if (access.is_admin) return true;
  return grantHas(scopeOf(access, action)?.visible_buildings, buildingId);
}

/** The user belongs to the building: reads it or a classroom in it. */
export function belongsTo(access: Access, buildingId: number): boolean {
  return canInBuilding(access, ClassroomAction.READ, buildingId);
}

/** Whether the user belongs to any building (admins: always). */
export function belongsToAnyBuilding(access: Access): boolean {
  if (!access) return false;
  if (access.is_admin) return true;
  const visible = scopeOf(access, ClassroomAction.READ)?.visible_buildings;
  return !!visible && (visible.all || visible.ids.length > 0);
}

/**
 * The buildings of `buildings` where the user can do `action`: on the
 * building or on one of its classrooms (`onBuilding` for the building only).
 */
export function filterBuildings<T extends { id: number }>(
  access: Access,
  action: AccessAction,
  buildings: T[],
  { onBuilding = false }: { onBuilding?: boolean } = {},
): T[] {
  const can = onBuilding ? canOnBuilding : canInBuilding;
  return buildings.filter((building) => can(access, action, building.id));
}

/** Same rule as the backend's SubjectPermissionChecker: the action on one of
 * the subject's buildings. */
export function canManageSubject(
  access: Access,
  subjectBuildingIds: number[],
  action: AccessAction = ClassroomAction.UPDATE,
): boolean {
  return subjectBuildingIds.some((id) => canOnBuilding(access, action, id));
}

interface ClassLike {
  schedules: { classroom_id?: number | null }[];
  subject_building_ids: number[];
}

/**
 * Same rule as the backend's ClassPermissionChecker: the action on the
 * classroom of an allocated schedule, or, for a schedule with no classroom,
 * on one of the subject's buildings.
 */
export function canManageClass(
  access: Access,
  cls: ClassLike,
  action: AccessAction = ClassroomAction.UPDATE,
): boolean {
  if (!access) return false;
  if (access.is_admin) return true;
  const byClassroom = cls.schedules.some(
    (schedule) =>
      !!schedule.classroom_id &&
      canOnClassroom(access, action, schedule.classroom_id),
  );
  if (byClassroom) return true;
  const hasUnallocated = cls.schedules.some(
    (schedule) => !schedule.classroom_id,
  );
  return (
    hasUnallocated && canManageSubject(access, cls.subject_building_ids, action)
  );
}
