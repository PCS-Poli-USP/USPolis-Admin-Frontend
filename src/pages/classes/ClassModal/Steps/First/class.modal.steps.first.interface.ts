import { ClassResponse } from "models/http/responses/class.response.models";
import { SubjectResponse } from "models/http/responses/subject.response.models";
import { ClassModalStepsProps } from "../class.modal.steps.interface";

export interface ClassModalFirstStepProps extends ClassModalStepsProps {
  isUpdate: boolean;
  subjects: SubjectResponse[];
  selectedClass?: ClassResponse;
}
export interface ClassFirstForm {
  subject_id: number;
  code: string;
  type: string;
  vacancies: number;
  subscribers: number;
  pendings: number;
  professors: string[];
}
