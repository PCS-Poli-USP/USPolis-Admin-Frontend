import {
  ClassroomPermissionByClassroomResponse,
  ClassroomPermissionByUserResponse,
  ClassroomPermissionResponse,
} from '../../models/http/responses/classroomPermission.response.models';

export function sortClassroomPermissionResponse(
  A: ClassroomPermissionResponse | ClassroomPermissionByClassroomResponse,
  B: ClassroomPermissionResponse | ClassroomPermissionByClassroomResponse,
) {
  if (A.classroom_name < B.classroom_name) return -1;
  if (A.classroom_name > B.classroom_name) return 1;
  return 0;
}

export function sortClassroomPermissionByUserResponse(
  A: ClassroomPermissionByUserResponse,
  B: ClassroomPermissionByUserResponse,
) {
  const lenthCompare =
    B.classroom_permissions.length - A.classroom_permissions.length;
  if (lenthCompare !== 0) return lenthCompare;
  if (A.user_name < B.user_name) return -1;
  if (A.user_name > B.user_name) return 1;
  return 0;
}
