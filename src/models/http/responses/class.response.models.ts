import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import { ClassType } from '../../../utils/enums/classes.enum';
import {
  ScheduleFullResponse,
  ScheduleResponse,
} from './schedule.response.models';

export interface ClassUnfetchResponseBase {
  id: number;
  start_date: string;
  end_date: string;
  code: string;
  professors: string[];
  type: ClassType;
  vacancies: number;
  air_conditionating: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
  ignore_to_allocate: boolean;
  full_allocated: boolean;
  updated_at: string;

  subject_id: number;
}
export interface ClassResponseBase extends ClassUnfetchResponseBase {
  subject_building_ids: number[];
  subject_name: string;
  subject_code: string;
  calendar_ids: number[];
  calendar_names: string[];
}

export interface ClassResponse extends ClassResponseBase {
  schedules: ScheduleResponse[];
}

export interface ClassFullResponse extends ClassResponseBase {
  schedules: ScheduleFullResponse[];
}

export interface ClassUnfetchResponse extends ClassUnfetchResponseBase {
  subject_id: number;
}
