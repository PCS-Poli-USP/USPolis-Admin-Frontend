export default interface Event {
  class_code: string;
  subject_code: string;
  start_period: string;
  end_period: string;
  week_day: string;
  start_time: string;
  end_time: string;
  has_to_be_allocated: boolean;
  classroom?: string;
  building?: string;
  professors?: string[];
  subscribers: number;
  vacancies: number;
  id?: string;
  subject_name?: string;
}

export interface EventByClassrooms {
  id?: string;
  subject_code: string;
  classroom: string;
  building: string;
  has_to_be_allocated: boolean;
  class_code: string;
  professors: string[];
  start_time: string;
  end_time: string;
  week_day: string;
  class_code_text: string;
  subscribers: number;
}
