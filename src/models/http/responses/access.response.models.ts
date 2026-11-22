// GET /users/my-access: the access the backend resolved for the logged user
// (roles, implied actions, building -> classroom cascade, wildcards and legacy
// groups already applied). Never recompute it from `loggedUser.buildings` or
// `groups`; read it through src/utils/access/access.ts.

/** Every id (`all`), or exactly `ids`. */
export interface AccessGrant {
  all: boolean;
  ids: number[];
}

export interface ActionScope {
  /** Buildings the action is granted on. */
  buildings: AccessGrant;
  /** Classrooms the action is granted on, building grants included. */
  classrooms: AccessGrant;
  /** Buildings with the action on the building or on any of its classrooms. */
  visible_buildings: AccessGrant;
}

export interface UserAccessResponse {
  is_admin: boolean;
  /** Keyed by action: create, read, update, delete, allocate, reserve, request. */
  scopes: Record<string, ActionScope>;
}
