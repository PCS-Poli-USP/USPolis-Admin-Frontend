import * as yup from 'yup';
import { ClassSecondForm } from './class.modal.steps.second.interface';
import { ScheduleValidator } from 'utils/schedules/schedules.validator';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

export const classSecondFormFields = {
  schedule_start_date: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-date', 'Data de início inválida', (value) => {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      }),
    defaultValue: '',
  },
  schedule_end_date: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-end-date', 'Data inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      })
      .test(
        'is-greater',
        'Data de fim não pode ser antes de início',
        function (value) {
          const { schedule_start_date } = this.parent;
          if (!value) return true;
          if (!schedule_start_date) return true;

          return !ScheduleValidator.isInvalidDateOferring(
            schedule_start_date,
            value,
          );
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
  week_day: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-week-day', 'Dia da semana inválido', function (value) {
        if (!value) return true;
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
        'Data de início inválida',
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
};

export const classSecondSchema = yup.object<ClassSecondForm>().shape({
  schedule_start_date: classSecondFormFields.schedule_start_date.validator,
  schedule_end_date: classSecondFormFields.schedule_end_date.validator,
  recurrence: classSecondFormFields.recurrence.validator,
  week_day: classSecondFormFields.week_day.validator,
  start_time: classSecondFormFields.start_time.validator,
  end_time: classSecondFormFields.end_time.validator,
  start_date: classSecondFormFields.start_date.validator,
  end_date: classSecondFormFields.end_date.validator,
  calendar_ids: classSecondFormFields.calendar_ids.validator,
});

export const classSecondDefaultValues: ClassSecondForm = {
  schedule_start_date: classSecondFormFields.schedule_start_date.defaultValue,
  schedule_end_date: classSecondFormFields.schedule_end_date.defaultValue,
  recurrence: classSecondFormFields.recurrence.defaultValue as Recurrence,
  week_day: classSecondFormFields.week_day.defaultValue as WeekDay,
  start_time: classSecondFormFields.start_time.defaultValue,
  end_time: classSecondFormFields.end_time.defaultValue,
  start_date: classSecondFormFields.start_date.defaultValue,
  end_date: classSecondFormFields.end_date.defaultValue,
  calendar_ids: classSecondFormFields.calendar_ids.defaultValue,
};
