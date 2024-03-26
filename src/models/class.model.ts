export default interface Class {
  class_code: string;
  subject_code: string;
  subject_name: string;
  professors: string[];
  start_period: string;
  end_period: string;
  start_time: string[];
  end_time: string[];
  week_days: string[];
  class_type: string;
  vacancies: number;
  subscribers: number;
  pendings: number;
  preferences: Preferences;
  has_to_be_allocated: boolean;
  ignore_to_allocate: boolean;
  classrooms?: string[];
  buildings?: string[];
  events_ids: string[];
}

export interface Preferences {
  building_id: string;
  air_conditioning?: boolean;
  projector?: boolean;
  accessibility?: boolean;
}

export interface CreateClassEvents {
  class_code: string;
  subject_code: string;
  subject_name: string;
  professors: string[];
  start_period: string;
  end_period: string;
  start_time: string;
  end_time: string;
  week_day: string;
  class_type: string;
  vacancies: number;
  subscribers: number;
  pendings: number;
  preferences: Preferences;
  has_to_be_allocated: boolean;
  ignore_to_allocate: boolean;
  classroom?: string;
}

export interface HasToBeAllocatedClass {
  subject_code: string;
  class_code: string;
  has_to_be_allocated: boolean;
  professors?: string[];
}
