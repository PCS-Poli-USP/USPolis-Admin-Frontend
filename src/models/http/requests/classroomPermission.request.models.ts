import { ClassroomPermissionType } from '../../../utils/enums/classroomPermissionType.enum';

export interface CreateClassroomPermission {
  classroom_id: number;
  user_id: number;
  permissions: ClassroomPermissionType[];
}

export interface UpdateClassroomPermission {
  permissions: ClassroomPermissionType[];
}

export interface CreateManyClassroomPermission {
  data: CreateClassroomPermission[];
}
