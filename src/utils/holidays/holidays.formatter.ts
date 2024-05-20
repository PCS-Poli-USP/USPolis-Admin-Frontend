import { HolidaysTypes } from 'utils/enums/holidays.enums';

export const holidaysTypeFormatter = (type: string) => {
  switch (type) {
    case HolidaysTypes.NATIONAL:
      return 'Nacional';
    case HolidaysTypes.USP:
      return 'Usp';
    case HolidaysTypes.EXAM:
      return 'Prova';
    case HolidaysTypes.OTHER:
      return 'Outro';
    default:
      return 'Tipo desconhecido';
  }
};

