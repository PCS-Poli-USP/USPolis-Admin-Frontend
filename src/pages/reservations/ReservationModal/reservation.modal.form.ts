import * as yup from 'yup';
import { ReservationForm } from './reservation.modal.interface';
import { ReservationValidator } from 'utils/reservations/resevations.validator';
import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import { Recurrence } from 'utils/enums/recurrence.enum';

export const formFields = {
  title: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-title',
        'Campo obrigatório',
        (value) => !ReservationValidator.isInvalidTitle(value),
      ),
    defaultValue: '',
  },
  type: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !ReservationValidator.isInvalidType(value),
      ),
    defaultValue: '',
  },
  reason: {
    validator: yup
      .string()
      .notRequired()
      .nullable()
      .test('is-valid-reason', 'Campo obrigatório', function (value) {
        if (!value) return true;
        return !ReservationValidator.isEmptyString(value);
      }),
    defaultValue: undefined,
  },
  building_id: {
    validator: yup
      .number()
      .required('Campo Obrigatório')
      .transform((curr, orig) => (orig === '' ? undefined : Number(curr)))
      .test('is-valid-id', 'Selecione um prédio', function (value) {
        return !ReservationValidator.isInvalidId(value);
      }),
    defaultValue: 0,
  },
  classroom_id: {
    validator: yup
      .number()
      .required('Campo Obrigatório')
      .transform((curr, orig) => (orig === '' ? undefined : Number(curr)))
      .test('is-valid-id', 'Selecione uma sala', function (value) {
        return !ReservationValidator.isInvalidId(value);
      }),
    defaultValue: 0,
  },
  start_time: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-daytime',
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidDayTime(value),
      ),
    defaultValue: '',
  },
  end_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-day-time', 'Horário inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDayTime(value);
      })
      .test(
        'is-greater',
        'Horário de fim não pode ser menor que início',
        function (value) {
          const { start_time } = this.parent;
          if (!value) return true;
          if (!start_time) return !ScheduleValidator.isInvalidDayTime(value);
          return !ScheduleValidator.isInvalidDayTimeOfering(start_time, value);
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
        'Campo obrigatório',
        (value) => !ScheduleValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-end-date', 'Data inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      })
      .test(
        'is-valid-end-date',
        'Data de fim deve ser após data de início',
        function (value) {
          const { start_date } = this.parent;
          if (!value) return true;
          if (!!start_date) return true;

          return !ScheduleValidator.isInvalidDateOferring(start_date, value);
        },
      ),
    defaultValue: '',
  },
  recurrence: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-recurrence', 'Recorrência inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidRecurrence(value);
      }),
    defaultValue: '',
  },
  month_week: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test('is-valid-month-week', 'Semana do mês inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidMonthWeek(value);
      }),
    defaultValue: undefined,
  },
  week_day: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test('is-valid-week-day', 'Dia da semana inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidWeekDay(value);
      }),
    defaultValue: undefined,
  },
};

export const schema = yup.object<ReservationForm>().shape({
  title: formFields.title.validator,
  type: formFields.type.validator,
  reason: formFields.reason.validator,
  building_id: formFields.building_id.validator,
  classroom_id: formFields.classroom_id.validator,
  start_date: formFields.start_date.validator,
  end_date: formFields.end_date.validator,
  recurrence: formFields.recurrence.validator,
  week_day: formFields.week_day.validator,
  start_time: formFields.start_time.validator,
  end_time: formFields.end_time.validator,
  month_week: formFields.month_week.validator,
});

export const defaultValues: ReservationForm = {
  title: formFields.title.defaultValue,
  type: formFields.type.defaultValue,
  reason: formFields.reason.defaultValue,
  building_id: formFields.building_id.defaultValue,
  classroom_id: formFields.classroom_id.defaultValue,
  start_date: formFields.start_date.defaultValue,
  end_date: formFields.end_date.defaultValue,
  recurrence: formFields.recurrence.defaultValue as Recurrence,
  week_day: formFields.week_day.defaultValue,
  start_time: formFields.start_time.defaultValue,
  end_time: formFields.end_time.defaultValue,
  month_week: formFields.month_week.defaultValue,
};
