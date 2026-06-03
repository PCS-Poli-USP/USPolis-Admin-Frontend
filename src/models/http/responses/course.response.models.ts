import { CoursePeriodType } from "../../../utils/enums/coursePeriodType.enum";

export interface CourseResponse {
    id: number,
    name: string,
    minimal_duration: number,
    ideal_duration: number,
    maximal_duration: number,
    created_at: string,
    created_by_id: number,
    updated_at: string,
    updated_by_id: number,
    period: CoursePeriodType
}