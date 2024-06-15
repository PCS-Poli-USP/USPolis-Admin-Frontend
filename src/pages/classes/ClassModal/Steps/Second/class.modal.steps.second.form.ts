import * as yup from 'yup';
import { ClassSecondForm } from './class.modal.steps.second.interface';
import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import moment from 'moment';

export const classSecondFormFields = {
  schedule_start_date: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-date', 'Data de início inválida', (value) => {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDayTime(value);
      }),
    defaultValue: '',
  },
  schedule_end_date: {
    validator: yup
      .string()
      .notRequired()
      .test(
        'is-valid-end-date',
        'Data de fim deve ser após data de início',
        function (value) {
          const { schedule_start_date } = this.parent;
          if (!value || !schedule_start_date) return true;

          const start = moment(schedule_start_date, 'YYYY:MM:DD');
          const end = moment(value, 'YYYY:MM:DD');
          return start.isBefore(end);
        },
      ),
    defaultValue: '',
  },
  week_day: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-week-day', 'Dia da semana inválido', function (value) {
        const { start_time, end_time } = this.parent;
        if (!start_time || !end_time || !value) return true;
        return !ScheduleValidator.isInvalidWeekDay(value);
      }),
    defaultValue: '',
  },
  start_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-day-time', 'Horário inválido', (value) => {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDayTime(value);
      }),
    defaultValue: '',
  },
  end_time: {
    validator: yup
      .string()
      .notRequired()
      .test(
        'is-greater',
        'Horário de fim deve ser maior que início',
        function (value) {
          const { start_time } = this.parent;
          if (!value || !start_time) return true;

          const start = moment(start_time, 'HH:mm');
          const end = moment(value, 'HH:mm');
          return start.isBefore(end);
        },
      ),
    defaultValue: '',
  },
  start_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data de início inválida',
        (value) => !ScheduleValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-end-date',
        'Data de fim deve ser após data de início',
        function (value) {
          const { start_date } = this.parent;
          if (!value || !start_date) return true;

          const start = moment(start_date, 'YYYY:MM:DD');
          const end = moment(value, 'YYYY:MM:DD');
          return start.isBefore(end);
        },
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
        'is-valid-recurrence',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidRecurrence(value),
      ),
    defaultValue: '',
  },
  week_days: {
    validator: yup
      .array()
      .of(
        yup
          .string()
          .required('Campo obrigatório')
          .test(
            'is-valid-week-day',
            'Escolha um dia válido',
            (value) => !ScheduleValidator.isInvalidWeekDay(value),
          ),
      )
      .min(1, 'Selecione pelo menos um dia')
      .required('Campo obrigatório'),
    defaultValue: [],
  },
  start_times: {
    validator: yup
      .array()
      .of(
        yup
          .string()
          .required('Escolha um horário de início')
          .test(
            'is-valid-day-time',
            'Horário inválido',
            (value) => !ScheduleValidator.isInvalidDayTime(value),
          ),
      )
      .min(1, 'Selecione pelo menos um horário de início')
      .required('Campo obrigatório'),
    defaultValue: [],
  },
  end_times: {
    validator: yup
      .array()
      .of(
        yup
          .string()
          .required('Escolha um horário de fim')
          .test(
            'is-valid-day-time',
            'Horário inválido',
            (value) => !ScheduleValidator.isInvalidDayTime(value),
          ),
      )
      .min(1, 'Selecione pelo menos um horário de fim')
      .required('Campo obrigatório'),
    defaultValue: [],
  },
};

export const classSecondSchema = yup.object<ClassSecondForm>().shape({
  schedule_start_date: classSecondFormFields.schedule_start_date.validator,
  schedule_end_date: classSecondFormFields.schedule_end_date.validator,
  week_day: classSecondFormFields.week_day.validator,
  start_time: classSecondFormFields.start_time.validator,
  end_time: classSecondFormFields.end_time.validator,
  start_date: classSecondFormFields.start_date.validator,
  end_date: classSecondFormFields.end_date.validator,
  calendar_ids: classSecondFormFields.calendar_ids.validator,
  recurrence: classSecondFormFields.recurrence.validator,
  week_days: classSecondFormFields.week_days.validator,
  start_times: classSecondFormFields.start_times.validator,
  end_times: classSecondFormFields.end_times.validator,
});

export const classSecondDefaultValues: ClassSecondForm = {
  start_date: classSecondFormFields.start_date.defaultValue,
  end_date: classSecondFormFields.end_date.defaultValue,
  calendar_ids: classSecondFormFields.calendar_ids.defaultValue,
  recurrence: classSecondFormFields.recurrence.defaultValue as Recurrence,
  week_days: classSecondFormFields.week_days.defaultValue as WeekDay[],
  start_times: classSecondFormFields.start_times.defaultValue,
  end_times: classSecondFormFields.end_times.defaultValue,
};
