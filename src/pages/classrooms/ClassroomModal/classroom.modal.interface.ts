import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { ModalProps } from '../../../models/interfaces';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';

export interface ClassroomModalProps extends ModalProps {
  isUpdate: boolean;
  buildings: BuildingResponse[];
  refetch: () => void;
  selectedClassroom?: ClassroomResponse;
}

export interface ClassroomForm {
  name: string;
  building_id: number;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
}
