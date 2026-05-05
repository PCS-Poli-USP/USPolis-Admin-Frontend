import { CurriculumSubjectCategory } from "../../../utils/enums/curriculumSubjectCategory.enum";
import { CurriculumSubjectType } from "../../../utils/enums/curriculumSubjectType.enum";

export interface CurriculumSubjectResponse {
  id: number;
  curriculum_id: number;
  subject_id: number;
  type: CurriculumSubjectType;
  category: CurriculumSubjectCategory;
  period: number;
}