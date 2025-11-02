import * as yup from 'yup';
import { ReservationValidator } from '../../../../../utils/reservations/resevations.validator';
import { ScheduleValidator } from '../../../../../utils/schedules/schedules.validator';
import { Recurrence } from '../../../../../utils/enums/recurrence.enum';
import { ReservationSecondForm } from './reservation.modal.steps.second.interface';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';

export const secondFormFields = {
  is_solicitation: {
    validator: yup
      .boolean()
      .required('Necessário informar se é uma solicitação'),
    defaultValue: false,
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
  optional_classroom: {
    validator: yup
      .boolean()
      .notRequired()
      .test(
        'optional_classroom-solicitation-only',
        'Apenas solicitação deve ter sala opcional',
        function (value) {
          const { is_solicitation } = this.parent as ReservationSecondForm;
          if (!is_solicitation && value != undefined) return false;
          return true;
        },
      )
      .test(
        'solicitation-must-have-optional_classroom-value',
        'Campo obrigatório',
        function (value) {
          const { is_solicitation } = this.parent as ReservationSecondForm;
          if (is_solicitation && value == undefined) return false;
          return true;
        },
      ),
    defaultValue: undefined,
  },
  classroom_id: {
    validator: yup
      .number()
      .notRequired()
      .test(
        'classroom_id-reservation',
        'Reserva deve ter uma sala',
        function (value) {
          const { is_solicitation } = this.parent as ReservationSecondForm;
          if (!is_solicitation && !value) return false;
          if (!is_solicitation && value)
            return !ReservationValidator.isInvalidId(value);
          return true;
        },
      )
      .test(
        'required_classroom-solicitation',
        'Sala deve ser fornecida para sala obrigatória',
        function (value) {
          const { required_classroom, is_solicitation } = this
            .parent as ReservationSecondForm;
          if (required_classroom && is_solicitation && !value) return false;
          if (required_classroom && is_solicitation && value)
            return !ReservationValidator.isInvalidId(value);
          return true;
        },
      )
      .test('is-valid-classroom-id', 'Campo obrigatório', function (value) {
        const { optional_classroom } = this.parent;
        if (optional_classroom) return true;
        if (!value && !optional_classroom) return false;
        if (value) return !ReservationValidator.isInvalidId(value);
        return true;
      }),
    defaultValue: undefined,
  },
  required_classroom: {
    validator: yup
      .boolean()
      .notRequired()
      .test(
        'solicitation-capacity-check',
        'Sala obrigatória deve ser informada apenas em solicitações',
        function (value) {
          const { is_solicitation } = this.parent as ReservationSecondForm;
          if (!is_solicitation && value != undefined) return false;
          return true;
        },
      )
      .test(
        'required-classroom-with-solicitation',
        'Campo obrigatório',
        function (value) {
          const { is_solicitation } = this.parent as ReservationSecondForm;
          if (is_solicitation && value == undefined) return false;
          return true;
        },
      )
      .test(
        'valid-required-and-optional-classroom',
        'Sala opcional deve ser falso para esse valor',
        function (value) {
          const { optional_classroom } = this.parent as ReservationSecondForm;
          if (!!optional_classroom && !!value) return false;
          return true;
        },
      ),
    defaultValue: undefined,
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
      .required('Campo obrigatório')
      .test('is-valid-day-time', 'Horário inválido', function (value) {
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
          if (start_date) return true;

          return !ScheduleValidator.isInvalidDateOferring(start_date, value);
        },
      ),
    defaultValue: '',
  },
  recurrence: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-recurrence', 'Recorrência inválida', function (value) {
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
      })
      .test(
        'must-have-mont-week-when-recurrence',
        'É preciso escolher uma semana do mês',
        function (value) {
          const { recurrence } = this.parent;
          if (!recurrence) return true;
          if (recurrence !== Recurrence.MONTHLY) return true;
          if (!value) return false;
          return !ScheduleValidator.isInvalidMonthWeek(value);
        },
      ),
    defaultValue: '',
  },
  week_day: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test('is-valid-week-day', 'Dia da semana inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidWeekDay(value);
      })
      .test(
        'must-have-week-day-when-recurrence',
        'É preciso escolher um dia da semana',
        function (value) {
          const { recurrence } = this.parent;
          if (!recurrence) return true;
          if (
            recurrence === Recurrence.CUSTOM ||
            recurrence === Recurrence.DAILY
          )
            return value === undefined || value === null;
          if (value === undefined || value === null) return false;
          return !ScheduleValidator.isInvalidWeekDay(value);
        },
      ),
    defaultValue: '',
  },
  labels: {
    validator: yup
      .array(yup.string())
      .notRequired()
      .test(
        'is-valid-type',
        'O tipo de reserva deve ser "Prova"',
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type !== ReservationType.EXAM) {
            if (value != undefined) return false;
          }
          return true;
        },
      )
      .test(
        'is-valid-labels',
        'É necessário especificar os nomes das provas',
        function (value) {
          const { type } = this.parent;
          if (type != ReservationType.EXAM) return true;
          if (!value) return false;
          return true;
        },
      ),
    defaultValue: undefined,
  },
  times: {
    validator: yup
      .array(yup.array(yup.string()))
      .notRequired()
      .test(
        'is-valid-type',
        'O tipo de reserva deve ser "Prova"',
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type !== ReservationType.EXAM) {
            if (value != undefined) return false;
          }
          return true;
        },
      )
      .test(
        'is-valid-times-length',
        'É necessário especificar os horários',
        function (value) {
          const { type } = this.parent;
          if (type != ReservationType.EXAM) return true;
          if (!value) return false;
          return true;
        },
      )
      .test(
        'is-valid-times',
        'Cada horário deve ter início e fim, sendo inicio antes de fim',
        function (value) {
          const { type } = this.parent;
          if (type != ReservationType.EXAM) return true;
          if (!value) return false;
          return ReservationValidator.isValidDayTimeOferings(
            value as [string, string][],
          );
        },
      ),

    defaultValue: undefined,
  },
};

export const secondSchema = yup.object<ReservationSecondForm>().shape({
  is_solicitation: secondFormFields.is_solicitation.validator,
  building_id: secondFormFields.building_id.validator,
  classroom_id: secondFormFields.classroom_id.validator,
  optional_classroom: secondFormFields.optional_classroom.validator,
  required_classroom: secondFormFields.required_classroom.validator,
  start_date: secondFormFields.start_date.validator,
  end_date: secondFormFields.end_date.validator,
  recurrence: secondFormFields.recurrence.validator,
  week_day: secondFormFields.week_day.validator,
  start_time: secondFormFields.start_time.validator,
  end_time: secondFormFields.end_time.validator,
  month_week: secondFormFields.month_week.validator,
  labels: secondFormFields.labels.validator,
  times: secondFormFields.times.validator,
});

export const secondDefaultValues: ReservationSecondForm = {
  is_solicitation: secondFormFields.is_solicitation.defaultValue,
  building_id: secondFormFields.building_id.defaultValue,
  classroom_id: secondFormFields.classroom_id.defaultValue,
  optional_classroom: secondFormFields.optional_classroom.defaultValue,
  required_classroom: secondFormFields.required_classroom.defaultValue,
  start_date: secondFormFields.start_date.defaultValue,
  end_date: secondFormFields.end_date.defaultValue,
  recurrence: secondFormFields.recurrence.defaultValue as Recurrence,
  week_day: secondFormFields.week_day.defaultValue,
  start_time: secondFormFields.start_time.defaultValue,
  end_time: secondFormFields.end_time.defaultValue,
  month_week: secondFormFields.month_week.defaultValue,
  labels: secondFormFields.labels.defaultValue,
  times: secondFormFields.times.defaultValue,
  type: undefined,
};
