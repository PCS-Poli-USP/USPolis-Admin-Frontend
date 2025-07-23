import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import { ConflictType } from '../../../utils/enums/conflictType.enum';

export interface CreateClassroom {
  name: string;
  building_id: number;
  group_ids: number[];
  floor: number;
  capacity: number;
  air_conditioning: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
  observation: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateClassroom extends CreateClassroom {}

export interface ClassroomConflictCheck {
  start_time: string;
  end_time: string;
  dates: string[];
  type: ConflictType;
}
