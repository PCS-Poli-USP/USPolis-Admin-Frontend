import { ClassroomPermissionType } from '../../../utils/enums/classroomPermissionType.enum';

export interface ClassroomPermissionResponse {
  id: number;
  classroom_id: number;
  classroom_name: string;

  permissions: ClassroomPermissionType[];
  given_by_id: number;
  given_by: string;
}

interface ClassroomPermissionsCore {
  permission_id: number;
  permissions: ClassroomPermissionType[];

  given_by_id: number;
  given_by: string;
  given_by_email: string;
}

export interface ClassroomUsersPermissioned extends ClassroomPermissionsCore {
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface UserClassroomPermissions extends ClassroomPermissionsCore {
  classroom_id: number;
  classroom_name: string;

  building_id: number;
  building_name: string;
}

export interface ClassroomPermissionByUserResponse {
  user_id: number;
  user_name: string;
  user_email: string;

  classroom_permissions: UserClassroomPermissions[];
}

export interface ClassroomPermissionByClassroomResponse {
  classroom_id: number;
  classroom_name: string;

  building_id: number;
  building_name: string;

  users_permissioned: ClassroomUsersPermissioned[];
}
