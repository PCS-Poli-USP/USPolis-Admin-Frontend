import { Row } from '@tanstack/react-table';
import { SubjectsTypes } from 'utils/enums/subjects.enum';
import moment from 'moment';
import { SubjectResponse } from 'models/http/responses/subject.response.models';

export const datetimeFormatter = (row: Row<SubjectResponse>) => {
  const start = row.original.activation;
  const end = row.original.desactivation;
  const startFormatted = moment(start).format('DD/MM/YYYY');

  if (end === start) {
    return moment(start).format('DD/MM/YYYY');
  } else {
    const endFormatted = moment(end).format('DD/MM/YYYY');
    return `${startFormatted} ~ ${endFormatted}`;
  }
};

export const subjectTypeFormatter = (type: string) => {
  switch (type) {
    case SubjectsTypes.BIANNUAL:
      return 'Semestral';
    case SubjectsTypes.FOUR_MONTHLY:
      return 'Quadrimestral';
    case SubjectsTypes.OTHER:
      return 'Outro';
    default:
      return 'Tipo desconhecido';
  }
};
