import { CalendarResponse } from "models/http/responses/calendar.responde.models";
import { ClassResponse } from "models/http/responses/class.response.models";
import { SubjectResponse } from "models/http/responses/subject.response.models";
import { ModalProps } from "models/interfaces";
import { MonthWeek } from "utils/enums/monthWeek.enum";
import { Recurrence } from "utils/enums/recurrence.enum";
import { WeekDay } from "utils/enums/weekDays.enum";

export interface ClassModalProps extends ModalProps {
  isUpdate: boolean;
  subjects: SubjectResponse[];
  calendars: CalendarResponse[];
  refetch: () => void;
  selectedClass?: ClassResponse;
}

export interface ClassForm {
  subject_id: number;
  code: string;
  type: string;
  professors: string[];
  start_date: string;
  end_date: string;
  calendar_ids: number[];

  vacancies: number;

  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;

  ignore_to_allocate: boolean;
}

export interface ScheduleData {
  week_day?: WeekDay;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  dates?: string[];
  month_week?: MonthWeek;
  allocated?: boolean;
  classroom_id?: number;
}

export interface ClassScheduleForm {
  week_days: string[];
  start_times: string[];
  end_times: string[];
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  skip_exceptions: boolean;
  all_day: boolean;
  allocated?: boolean;
}
