import { Row } from '@tanstack/react-table';
import { Subject } from 'models/database/subject.models';
import { SubjectsTypes } from 'models/enums/subjects.enum';
import moment from 'moment';

export const datetimeFormatter = (row: Row<Subject>) => {
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

export const typeFormatter = (row: Row<Subject>) => {
  switch (row.original.type) {
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
