import { CurriculumSubjectCategory } from "../../../utils/enums/curriculumSubjectCategory.enum";
import { CurriculumSubjectType } from "../../../utils/enums/curriculumSubjectType.enum";

export interface CreateCurriculumSubject {
  curriculum_id: number;
  subject_id: number;
  type: CurriculumSubjectType;
  category: CurriculumSubjectCategory;
  period: number;
}

export interface UpdateCurriculumSubject extends CreateCurriculumSubject {}