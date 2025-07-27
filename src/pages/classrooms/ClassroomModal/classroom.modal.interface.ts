import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { GroupResponse } from '../../../models/http/responses/group.response.models';
import { ModalProps } from '../../../models/interfaces';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';

export interface ClassroomModalProps extends ModalProps {
  isUpdate: boolean;
  buildings: BuildingResponse[];
  groups: GroupResponse[];
  refetch: () => void;
  selectedClassroom?: ClassroomResponse;
}

export interface ClassroomForm {
  name: string;
  building_id: number;
  floor: number;
  capacity: number;
  air_conditioning: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
  observation: string;
  reservable: boolean;
  remote: boolean;
  group_ids: number[];
}
