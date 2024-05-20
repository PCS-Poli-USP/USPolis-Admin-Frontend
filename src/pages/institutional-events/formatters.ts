import { Row } from '@tanstack/react-table';
import { InstitutionalEvent } from 'models/common/institutionalEvent.model';
import moment from 'moment';

export const periodFormatter = (row: Row<InstitutionalEvent>) => {
  const start = row.original.start_datetime;
  const end = row.original.end_datetime;
  const startFormatted = moment(start).format('DD/MM/YYYY HH:mm');

  if (end === start) {
    return moment(start).format('DD/MM/YYYY');
  } else {
    const endFormatted = moment(end).format('DD/MM/YYYY HH:mm');
    return `${startFormatted} ~ ${endFormatted}`;
  }
};
