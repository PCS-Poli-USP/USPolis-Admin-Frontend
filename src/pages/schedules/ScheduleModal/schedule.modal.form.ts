import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import * as yup from 'yup';
import { ScheduleForm } from './schedule.modal.interface';
import { Recurrence } from 'utils/enums/recurrence.enum';

export const formFields = {
  week_day: {
    validator: yup
      .number()
      .required()
      .test(
        'is-valid-week-day',
        'Escolha um dia válido',
        (value) => !ScheduleValidator.isInvalidWeekDay(value),
      ),
    defaultValue: -1,
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
  calendar_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
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
  skip_exceptions: {
    validator: yup.boolean().required(),
    defaultValue: false,
  },
  all_day: {
    validator: yup.boolean().required(),
    defaultValue: false,
  },
};

export const schema = yup.object<ScheduleForm>().shape({
  week_day: formFields.week_day.validator,
  start_time: formFields.start_time.validator,
  end_time: formFields.end_time.validator,
  calendar_id: formFields.calendar_id.validator,
  start_date: formFields.start_date.validator,
  end_date: formFields.end_date.validator,
  recurrence: formFields.recurrence.validator,
  skip_exceptions: formFields.skip_exceptions.validator,
  all_day: formFields.all_day.validator,
});

export const defaultValues: ScheduleForm = {
  week_day: formFields.week_day.defaultValue,
  start_time: formFields.start_time.defaultValue,
  end_time: formFields.end_time.defaultValue,
  calendar_id: formFields.calendar_id.defaultValue,
  start_date: formFields.start_date.defaultValue,
  end_date: formFields.end_date.defaultValue,
  recurrence: formFields.recurrence.defaultValue as Recurrence,
  skip_exceptions: formFields.skip_exceptions.defaultValue,
  all_day: formFields.all_day.defaultValue,
};
