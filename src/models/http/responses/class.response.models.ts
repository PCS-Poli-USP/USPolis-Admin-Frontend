import { ClassType } from 'utils/enums/classes.enum';
import {
  ScheduleFullResponse,
  ScheduleResponse,
} from './schedule.response.models';

export interface ClassResponseBase {
  id: number;
  start_date: string;
  end_date: string;
  code: string;
  professors: string[];
  type: ClassType;
  vacancies: number;
  subscribers: number;
  pendings: number;
  air_conditionating: boolean;
  projector: boolean;
  accessibility: boolean;
  ignore_to_allocate: boolean;
  full_allocated: boolean;
  updated_at: string;

  subject_id: number;
  subject_name: string;
  subject_code: string;
  schedules: ScheduleResponse[];
  calendar_ids?: number[];
  calendar_names?: string[];
}

export interface ClassResponse extends ClassResponseBase {
  schedules: ScheduleResponse[];
}

export interface ClassFullResponse extends ClassResponseBase {
  schedules: ScheduleFullResponse[];
}

export interface ClassUnfetchResponse extends ClassResponseBase {
  subject_id: number;
}
