import { SolicitationValidator } from 'utils/solicitations/solicitation.validator';
import * as yup from 'yup';
import { SolicitationForm } from './solicitation.modal.interface';
import { ReservationType } from 'utils/enums/reservations.enum';

export const formFields = {
  building_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-building-id',
        'Campo obrigatório',
        (value) => !SolicitationValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  optional_classroom: {
    validator: yup.boolean().required(),
    defaultValue: false,
  },
  required_classroom: {
    validator: yup.boolean().required(),
    defaultValue: false,
  },
  classroom_id: {
    validator: yup
      .number()
      .notRequired()
      .test('is-valid-classroom-id', 'Campo obrigatório', function (value) {
        const { optional_classroom } = this.parent;
        if (optional_classroom) return true;
        if (!value && !optional_classroom) return false;
        if (value) return !SolicitationValidator.isInvalidId(value);
        return true;
      }),
    defaultValue: undefined,
  },
  capacity: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test('is-valid-capacity', 'Escolha uma capacidade', (value) =>
        SolicitationValidator.isPositiveNumber(value),
      ),
    defaultValue: 0,
  },
  reason: {
    validator: yup
      .string()
      .notRequired()
      .nullable()
      .test('is-valid-reason', 'Campo obrigatório', function (value) {
        if (!value) return true;
        return !SolicitationValidator.isEmptyString(value);
      }),
    defaultValue: undefined,
  },
  reservation_title: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-title',
        'Campo obrigatório',
        (value) => !SolicitationValidator.isEmptyString(value),
      ),
    defaultValue: '',
  },
  reservation_type: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-reservation-type',
        'Campo obrigatório',
        (value) => !SolicitationValidator.isInvalidReservationType(value),
      ),
    defaultValue: '',
  },

  optional_time: {
    validator: yup.boolean().required(),
    defaultValue: false,
  },
  start_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-daytime', 'Campo obrigatório', function (value) {
        const { optional_time } = this.parent;
        if (optional_time) return true;
        if (!value && !optional_time) return false;
        if (value) return !SolicitationValidator.isInvalidDayTime(value);
        return true;
      }),
    defaultValue: undefined,
  },
  end_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-day-time', 'Horário inválido', function (value) {
        const { optional_time } = this.parent;
        if (optional_time) return true;
        if (!value && !optional_time) return false;
        if (value) return !SolicitationValidator.isInvalidDayTime(value);
        return true;
      })
      .test(
        'is-greater',
        'Horário de fim não pode ser menor que início',
        function (value) {
          const { start_time, optional_time } = this.parent;
          if (optional_time) return true;
          if (!value && !optional_time) return false;
          if (!start_time) {
            if (value) return !SolicitationValidator.isInvalidDayTime(value);
          }
          if (value && start_time)
            return !SolicitationValidator.isInvalidDayTimeOfering(
              start_time,
              value,
            );
          return true;
        },
      ),
    defaultValue: undefined,
  },
};

export const schema = yup.object<SolicitationForm>().shape({
  building_id: formFields.building_id.validator,
  optional_classroom: formFields.optional_classroom.validator,
  required_classroom: formFields.required_classroom.validator,
  classroom_id: formFields.classroom_id.validator,
  capacity: formFields.capacity.validator,
  optional_time: formFields.optional_time.validator,
  start_time: formFields.start_time.validator,
  end_time: formFields.end_time.validator,
  reservation_title: formFields.reservation_title.validator,
  reservation_type: formFields.reservation_type.validator,
  reason: formFields.reason.validator,
});

export const defaultValues: SolicitationForm = {
  building_id: formFields.building_id.defaultValue,
  optional_classroom: formFields.optional_classroom.defaultValue,
  required_classroom: formFields.required_classroom.defaultValue,
  classroom_id: formFields.classroom_id.defaultValue,
  capacity: formFields.capacity.defaultValue,
  optional_time: formFields.optional_time.defaultValue,
  start_time: formFields.start_time.defaultValue,
  end_time: formFields.end_time.defaultValue,
  reservation_title: formFields.reservation_title.defaultValue,
  reservation_type: formFields.reservation_type.defaultValue as ReservationType,
  reason: formFields.reason.defaultValue,
};
