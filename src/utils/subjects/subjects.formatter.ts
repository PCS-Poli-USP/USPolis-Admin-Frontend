import { SubjectType } from 'utils/enums/subjects.enum';

export const subjectTypeFormatter = (type: string) => {
  switch (type) {
    case SubjectType.BIANNUAL:
      return 'Semestral';
    case SubjectType.FOUR_MONTHLY:
      return 'Quadrimestral';
    case SubjectType.OTHER:
      return 'Outro';
    default:
      return 'Tipo desconhecido';
  }
};
