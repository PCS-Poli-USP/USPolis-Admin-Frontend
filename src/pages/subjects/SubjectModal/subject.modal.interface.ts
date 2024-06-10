import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { ModalProps } from 'models/interfaces';
import { SubjectsTypes } from 'utils/enums/subjects.enum';

export interface SubjectForm {
  code: string;
  name: string;
  type: SubjectsTypes;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface SubjectModalProps extends ModalProps {
  isUpdate: boolean;
  refetch: () => void;
  selectedSubject?: SubjectResponse;
}
