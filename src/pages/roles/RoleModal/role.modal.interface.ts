import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { ModalProps } from '../../../models/interfaces';

export interface RoleModalProps extends ModalProps {
  isUpdate: boolean;
  handleSave: () => void;
  handleClose: () => void;
  loading?: boolean;
  refetch: () => void;
  selectedRole?: RoleResponse;
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
}

export interface RoleForm {
  name: string;
  description: string;
}
