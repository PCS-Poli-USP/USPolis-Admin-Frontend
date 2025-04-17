import { ClassType } from "../../utils/enums/classes.enum";

export default interface Class {
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
  accessibility: boolean;
  projector: boolean;

  ignore_to_allocate: boolean;
  full_allocated: boolean;
  updated_at: string;

  subject_id: number;
}