import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import { ScheduleFullResponse } from './schedule.response.models';

export interface ClassroomResponse {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  ignore_to_allocate: boolean;
  accessibility: boolean;
  audiovisual: AudiovisualType;
  air_conditioning: boolean;
  observation: string;
  updated_at: string;
  created_by_id: number;
  created_by: string;
  building_id: number;
  building: string;
  group_ids: number[];
  groups: string[];
}

export interface ClassroomFullResponse extends ClassroomResponse {
  schedules: ScheduleFullResponse[];
}

export interface ConflictsInfo {
  subject_id?: number;
  subject?: string;
  class_id?: number;
  class_code?: string;
  reservation?: string;
  reservation_id?: number;
  schedule_id: number;
  start: string;
  end: string;
  total_count: number;
  intentional_ids: number[];
  intentional_count: number;
  unintentional_ids: number[];
  unintentional_count: number;
}

export interface ClassroomWithConflictCount extends ClassroomResponse {
  conflicts: number;
  conflicts_infos: ConflictsInfo[];
}
