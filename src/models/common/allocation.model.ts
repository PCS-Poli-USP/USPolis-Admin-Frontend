export interface Allocation {
  title: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startRecur: string;
  endRecur: string;
  resourceId: string;
  extendedProps: {
    id: string | undefined;
    building: string | undefined;
    class_code: string;
    subject_code: string;
    subject_name: string | undefined;
    classroom: string;
    has_to_be_allocated: boolean;
    professors: string[];
    start_time: string;
    end_time: string;
    week_day: string;
    class_code_text: string;
    subscribers: number;
  };
}
