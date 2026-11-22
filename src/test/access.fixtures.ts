import {
  AccessGrant,
  ActionScope,
  UserAccessResponse,
} from '../models/http/responses/access.response.models';
import { ClassroomAction } from '../utils/enums/actions.enums';

// Builds a GET /users/my-access response for tests, as the backend resolves
// it: every action present, nothing granted unless given.

const NONE: AccessGrant = { all: false, ids: [] };
const ALL: AccessGrant = { all: true, ids: [] };

export function grant(...ids: number[]): AccessGrant {
  return { all: false, ids };
}

function emptyScope(): ActionScope {
  return { buildings: NONE, classrooms: NONE, visible_buildings: NONE };
}

export function makeAccess(
  scopes: Partial<Record<ClassroomAction, Partial<ActionScope>>> = {},
): UserAccessResponse {
  const result: Record<string, ActionScope> = {};
  for (const action of Object.values(ClassroomAction)) {
    result[action] = { ...emptyScope(), ...scopes[action] };
  }
  return { is_admin: false, scopes: result };
}

export function adminAccess(): UserAccessResponse {
  const scope = { buildings: ALL, classrooms: ALL, visible_buildings: ALL };
  const scopes: Record<string, ActionScope> = {};
  for (const action of Object.values(ClassroomAction)) scopes[action] = scope;
  return { is_admin: true, scopes };
}
