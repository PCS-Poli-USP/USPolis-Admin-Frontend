import * as yup from 'yup';
import { ClassSecondForm } from './class.modal.steps.second.interface';
import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export const classSecondFormFields = {
  start_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  calendar_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(1, 'Coloque pelo menos um calendário')
      .test(
        'is-valid-array',
        'Calendários inválidos',
        (value) => value && !ScheduleValidator.isInvalidIdArray(value),
      ),
    defaultValue: [],
  },
  recurrence: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidRecurrence(value),
      ),
    defaultValue: '',
  },
  week_day: {
    validator: yup
      .string()
      .required()
      .test(
        'is-valid-week-day',
        'Escolha um dia válido',
        (value) => !ScheduleValidator.isInvalidWeekDay(value),
      ),
    defaultValue: '',
  },
  start_time: {
    validator: yup
      .string()
      .required('Escolha um horário de início')
      .test(
        'is-valid-day-time',
        'Horário inválido',
        (value) => !ScheduleValidator.isInvalidDayTime(value),
      ),
    defaultValue: '',
  },
  end_time: {
    validator: yup
      .string()
      .required('Escolha um horário de fim')
      .test(
        'is-valid-day-time',
        'Horário inválido',
        (value) => !ScheduleValidator.isInvalidDayTime(value),
      ),
    defaultValue: '',
  },
};

export const classSecondSchema = yup.object<ClassSecondForm>().shape({
  start_date: classSecondFormFields.start_date.validator,
  end_date: classSecondFormFields.end_date.validator,
  calendar_ids: classSecondFormFields.calendar_ids.validator,
  recurrence: classSecondFormFields.recurrence.validator,
  week_day: classSecondFormFields.week_day.validator,
  start_time: classSecondFormFields.start_date.validator,
  end_time: classSecondFormFields.start_date.validator,
});

export const classSecondDefaultValues: ClassSecondForm = {
  start_date: classSecondFormFields.start_date.defaultValue,
  end_date: classSecondFormFields.end_date.defaultValue,
  calendar_ids: classSecondFormFields.calendar_ids.defaultValue,
  recurrence: classSecondFormFields.recurrence.defaultValue as Recurrence,
  week_day: classSecondFormFields.week_day.defaultValue as WeekDay,
  start_time: classSecondFormFields.start_date.defaultValue,
  end_time: classSecondFormFields.start_date.defaultValue,
};
