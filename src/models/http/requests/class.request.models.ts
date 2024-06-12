import { ClassType } from 'utils/enums/classes.enum';
import { CreateManySchedule } from './schedule.request.models';

export interface ClassBase {
  start_date: string;
  end_date: string;
  code: string;
  type: ClassType;
  professors: string[];
  vacancies: number;
  subscribers: number;
  pendings: number;
  air_conditionating: boolean;
  accessibility: boolean;
  projector: boolean;
  ignore_to_allocate: boolean;
  full_allocated: boolean;
  calendar_ids: number[];
}

export interface CreateClass extends ClassBase {
  subject_id: number;
  schedules_data: CreateManySchedule;
}

export interface UpdateClass extends CreateClass {}
