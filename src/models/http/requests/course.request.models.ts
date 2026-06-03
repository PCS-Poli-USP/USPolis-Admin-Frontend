import { CoursePeriodType } from "../../../utils/enums/coursePeriodType.enum";

export interface CreateCourse {
    name: string;
    minimal_duration: number;
    ideal_duration: number;
    maximal_duration: number;
    period: CoursePeriodType;
}

export interface UpdateCourse extends CreateCourse {}
