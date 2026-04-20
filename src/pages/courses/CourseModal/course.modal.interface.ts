import { ModalProps } from '../../../models/interfaces';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { CoursePeriodType } from '../../../utils/enums/coursePeriodType.enum';

export interface CourseModalProps extends ModalProps {
  isUpdate: boolean;
  refetch: () => void;
  selectedCourse?: CourseResponse;
}

export interface CourseForm {
  name: string;
  ideal_duration: number;
  minimal_duration: number;
  maximal_duration: number;
  period: CoursePeriodType;
}