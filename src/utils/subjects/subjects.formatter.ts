import { Row } from '@tanstack/react-table';
import { Subject } from 'models/database/subject.models';
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
