import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import { ClassType } from '../../../utils/enums/classes.enum';
import { CreateSchedule, UpdateSchedule } from './schedule.request.models';

export interface ClassBase {
  start_date: string;
  end_date: string;
  code: string;
  type: ClassType;
  professors: string[];
  vacancies: number;
  air_conditionating: boolean;
  accessibility: boolean;
  audiovisual: AudiovisualType;
  ignore_to_allocate: boolean;
  calendar_ids: number[];
}

export interface CreateClass extends ClassBase {
  subject_id: number;
  schedules_data: CreateSchedule[];
}

export interface UpdateClass extends ClassBase {
  subject_id: number;
  schedules_data: UpdateSchedule[];
}
