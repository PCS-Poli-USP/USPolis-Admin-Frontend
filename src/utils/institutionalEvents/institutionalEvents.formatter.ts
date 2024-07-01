import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import moment from 'moment';

export const periodFormatter = (data: InstitutionalEventResponse) => {
  const start = data.start;
  const end = data.end;
  const startFormatted = moment(start).format('DD/MM/YYYY HH:mm');

  if (end === start) {
    return moment(start).format('DD/MM/YYYY');
  } else {
    const endFormatted = moment(end).format('DD/MM/YYYY HH:mm');
    return `${startFormatted} ~ ${endFormatted}`;
  }
};
