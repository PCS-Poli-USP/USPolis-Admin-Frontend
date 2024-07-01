import { BuildingResponse } from 'models/http/responses/building.response.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { ModalProps } from 'models/interfaces';
import { SubjectType } from 'utils/enums/subjects.enum';

export interface SubjectForm {
  building_ids: number[];
  professors: string[];
  code: string;
  name: string;
  type: SubjectType;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface SubjectModalProps extends ModalProps {
  buildings: BuildingResponse[];
  isUpdate: boolean;
  refetch: () => void;
  selectedSubject?: SubjectResponse;
}
