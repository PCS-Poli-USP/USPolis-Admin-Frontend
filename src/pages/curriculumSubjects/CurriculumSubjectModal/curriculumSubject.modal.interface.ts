import { ModalProps } from '../../../models/interfaces';
import { CurriculumSubjectResponse } from '../../../models/http/responses/curriculumSubject.response.models';
import { CurriculumSubjectType } from '../../../utils/enums/curriculumSubjectType.enum';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { CurriculumSubjectCategory } from '../../../utils/enums/curriculumSubjectCategory.enum';

export interface CurriculumSubjectModalProps extends ModalProps {
  isUpdate: boolean;
  refetch: () => void;
  selectedItem?: CurriculumSubjectResponse;
  course?: CourseResponse;
  defaultPeriod?: number;
}

export interface CurriculumSubjectForm {
  subject_ids: number[];
  type: CurriculumSubjectType;
  category: CurriculumSubjectCategory;
}