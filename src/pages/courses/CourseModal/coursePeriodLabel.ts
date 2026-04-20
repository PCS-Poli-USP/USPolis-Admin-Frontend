import { CoursePeriodType } from "../../../utils/enums/coursePeriodType.enum";

export function getCoursePeriodLabel(period: CoursePeriodType) {
  switch (period) {
    case CoursePeriodType.INTEGRAL:
      return 'Integral';
    case CoursePeriodType.MORNING:
      return 'Matutino';
    case CoursePeriodType.AFTERNOON:
      return 'Vespertino';
    case CoursePeriodType.EVENING:
      return 'Noturno';
    default:
      return '-';
  }
}