import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import * as yup from 'yup';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ClassScheduleForm } from './class.register.modal.interface';

export const formFields = {
  week_days: {
    validator: yup
      .array()
      .of(yup.string().required('Escolha um dia da semana'))
      .min(1, 'Selecione pelo menos um dia da semana')
      .test(
        'is-valid-array-of-day-time',
        'Dias inválidos',
        (values) => values && !ScheduleValidator.isInvalidWeekDayArray(values),
      ),
    defaultValue: [],
  },
  start_times: {
    validator: yup
      .array()
      .of(yup.string().required('Escolha um horário de fim'))
      .min(1, 'Selecione pelo menos uma data de fim')
      .test(
        'is-valid-array-of-day-time',
        'Horários inválidos',
        (values) => values && !ScheduleValidator.isInvalidDayTimeArray(values),
      ),
    defaultValue: [],
  },
  end_times: {
    validator: yup
      .array()
      .of(yup.string().required('Escolha um horário de fim'))
      .min(1, 'Selecione pelo menos uma data de fim')
      .test(
        'is-valid-array-of-day-time',
        'Horários inválidos',
        (values) => values && !ScheduleValidator.isInvalidDayTimeArray(values),
      ),
    defaultValue: [],
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

export const schema = yup.object<ClassScheduleForm>().shape({
  week_days: formFields.week_days.validator,
  start_times: formFields.start_times.validator,
  end_times: formFields.end_times.validator,
  calendar_id: formFields.calendar_id.validator,
  start_date: formFields.start_date.validator,
  end_date: formFields.end_date.validator,
  recurrence: formFields.recurrence.validator,
  skip_exceptions: formFields.skip_exceptions.validator,
  all_day: formFields.all_day.validator,
});

export const defaultValues: ClassScheduleForm = {
  week_days: formFields.week_days.defaultValue,
  start_times: formFields.start_times.defaultValue,
  end_times: formFields.end_times.defaultValue,
  calendar_id: formFields.calendar_id.defaultValue,
  start_date: formFields.start_date.defaultValue,
  end_date: formFields.end_date.defaultValue,
  recurrence: formFields.recurrence.defaultValue as Recurrence,
  skip_exceptions: formFields.skip_exceptions.defaultValue,
  all_day: formFields.all_day.defaultValue,
};
