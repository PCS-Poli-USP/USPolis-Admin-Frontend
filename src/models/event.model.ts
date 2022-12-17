export default interface Event {
  class_code: string;
  subject_code: string;
  start_period: string;
  end_period: string;
  week_day: string;
  start_time: string;
  end_time: string;
  classroom?: string;
  building?: string;
  professor?: string;
  subscribers: number;
}

export interface EventByClassrooms {
  subjectCode: string;
  classroom: string;
  building: string;
  classCode: string;
  professor: string;
  startTime: string;
  endTime: string;
  weekday: string;
  classCodeText: string;
  subscribers: number;
}
