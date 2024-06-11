import { ClassResponse } from "models/http/responses/class.response.models";
import { SubjectResponse } from "models/http/responses/subject.response.models";
import { ModalProps } from "models/interfaces";
import { Recurrence } from "utils/enums/recurrence.enum";

export interface ClassModalProps extends ModalProps {
  isUpdate: boolean;
  subjects: SubjectResponse[];
  selectedClass?: ClassResponse;
}

export interface ClassForm {
  subject_id: number;
  code: string;
  type: string;
  professors: string[];
  semester: number;
  start_date: string;
  end_date: string;

  vacancies: number;
  subscribers: number;
  pendings: number;

  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;

  ignore_to_allocate: boolean;
}

export interface ClassScheduleForm {
  week_days: string[];
  start_times: string[];
  end_times: string[];
  calendar_id: number;
  start_date: string;
  end_date: string;
  recurrence: Recurrence;
  skip_exceptions: boolean;
  all_day: boolean;
  allocated?: boolean;
}
