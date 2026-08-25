# Frontend migration changelog

Backend API contract changes on `feature/role-based-permissions` that the frontend needs to account for. Newest changes first.

## `Role`/`Permission` now actually grant access at request time

Every existing `Group` has been migrated into an equivalent `Role` (one `Role` per `Group`, `BuildingPermission` for the main group, `ClassroomPermission` per classroom for other groups, members carried over as `UserRole`). Until now, `Role`/`Permission` existed as data but never affected what a request was allowed to do — every check ran on `Group` membership only. That's no longer true: every resource endpoint now checks `Group` membership **or** `Role`/`Permission`, so a role assigned via `/admin/roles` genuinely grants access. See the "What action do I need?" table in `README.md` for exactly which `(Resource, Action)` pair each operation checks.

**Action items for frontend:** if there's any UI copy suggesting `Role`/`Permission` assignment is a no-op or "coming soon", that's no longer accurate — assigning a role now has an immediate, real effect on what that user can do.

## Booking lifecycle and turma/disciplina deletion now use different actions than before

Two action-mapping corrections, both affecting **what permission a role needs** to perform an operation — no request/response shape changed, but a role that only has `CREATE`/`UPDATE`/`DELETE` may now be missing access it used to implicitly have, or may need less than it used to:

- **Creating, updating, or canceling a `Reservation`, `Meeting`, `Event`, or `Exam`, and approving/denying a `Solicitation`, now all require the `RESERVE` action** (previously spread across `CREATE`/`UPDATE`/`DELETE`). A role that could book/cancel rooms via `UPDATE`/`DELETE` before now needs `RESERVE` instead.
- **Deleting a `Class` ("turma") or a `Subject` ("disciplina") now requires `UPDATE`, not `DELETE`.** `DELETE` is reserved exclusively for destroying the `Building`/`Classroom` record itself, so a role that manages turmas/disciplinas no longer needs (and no longer implicitly gets) the ability to delete rooms/buildings.

**Action items for frontend:** if there's a permission-picker UI that lets an admin choose which actions to grant per resource, make sure `RESERVE` is presented as "book/cancel reservations, meetings, events, exams; approve/deny solicitations" and `UPDATE` is presented as covering "delete turma/disciplina" too, so admins aren't surprised when a `DELETE`-only role can't do either of those.

## Permissions: `role_id` is now required, point permissions removed

A `Permission` can no longer be granted directly to a user — it must always belong to a `Role`.

**`POST /admin/permissions`, `PUT /admin/permissions/{id}`** (`PermissionRegister` / `PermissionUpdate` body):
- `user_id` field **removed** from the request body.
- `role_id` is now **required** (previously optional; the old rule was "send exactly one of `user_id` or `role_id`"). Omitting it now returns a standard FastAPI/Pydantic `422` instead of the old custom `400` errors ("Permissão deve ter User ID ou Role ID definido" / "...não pode ter User ID e Role ID definido ao mesmo tempo" — those error messages no longer exist).

**`GET /admin/permissions`, `GET /admin/permissions/{id}`, `GET /admin/permissions/all`** and permissions embedded in `GET /admin/roles*` (`PermissionResponse` body):
- `user_id`, `user_name`, `user_email` fields **removed** from the response.
- `role_id` and `role_name` are now always present/non-null (previously could be `null` for a point permission).

**`POST /admin/roles`, `PUT /admin/roles/{id}`** (`RoleRegister` / `RoleUpdate` body):
- `permission_ids` field **removed** (it used to let you re-attach an existing standalone permission to a role by `[id, resource]`; that concept no longer exists since every permission always belongs to some role already). To add permissions when creating/editing a role, send full permission objects in the `permissions` field instead (same as before, just without `user_id`).

**Action items for frontend:**
- Remove any UI/form that lets an admin grant a permission directly to a specific user instead of through a role.
- Remove any UI that shows/edits "owner user" of an individual permission (avatar, email, etc. next to a permission row).
- Remove any "attach existing permission to role" flow keyed by `permission_ids`.
- Update the create/edit permission form to require selecting a role.

## `BuildingAction` gains `ALLOCATE` and `RESERVE`

`BuildingAction` used to only have `CREATE`/`READ`/`UPDATE`/`DELETE`. It now also has `ALLOCATE` and `RESERVE` (same two actions `ClassroomAction` already had). If the frontend has a hardcoded list of actions available per resource type (e.g. an action-picker when creating a `BuildingPermission`), it needs to allow these two for `BUILDING` as well as `CLASSROOM`.

This exists so a single `BuildingPermission` can grant "allocate/reserve any room in this building" without creating one `ClassroomPermission` per room — see the Permissions section in `README.md` for the full cascade/wildcard policy.

## `DELETE /admin/users/{user_id}` removed

This endpoint is gone (previously it already didn't actually delete the user — it silently no-op'd and returned a fake success message; it now doesn't exist at all and returns `404`/`405`). If the frontend has a "delete user" button anywhere, remove it — there is currently no supported way to delete a user.
