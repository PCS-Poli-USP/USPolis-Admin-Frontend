import { BuildingResponse } from "../../../models/http/responses/building.response.models";
import { ClassroomResponse } from "../../../models/http/responses/classroom.response.models";
import { GroupResponse } from "../../../models/http/responses/group.response.models";
import { UserResponse } from "../../../models/http/responses/user.response.models";
import { ModalProps } from "../../../models/interfaces";

export interface GroupModalProps extends ModalProps {
  group?: GroupResponse;
  classrooms: ClassroomResponse[];
  users: UserResponse[];
  buildings: BuildingResponse[];
  isUpdate: boolean;
  refetch: () => void;
}

export interface GroupForm {
  name: string;
  classroom_ids: number[];
  user_ids: number[];
}