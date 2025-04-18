import { AudiovisualType } from "../../../utils/enums/audiovisualType.enum";

export interface CreateClassroom {
  name: string;
  building_id: number;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
}

export interface UpdateClassroom extends CreateClassroom {}

export interface ClassroomConflictCheck {
  start_time: string;
  end_time: string;
  dates: string[];
}
