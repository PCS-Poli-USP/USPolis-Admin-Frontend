import * as yup from 'yup';
import { ReservationValidator } from '../../../../../utils/reservations/resevations.validator';
import { ReservationFirstForm } from './reservation.modal.steps.first.interface';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';

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
  link: {
    validator: yup
      .string()
      .nullable()
      .test(
        'have-valid-reservation-type',
        `O tipo de reserva deve ser "Reunião" ou "Evento"`,
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type == ReservationType.EXAM) {
            if (!value) return true;
            return false;
          }
          return true;
        },
      )
      .test('is-valid-link', `Campo inválido`, function (value) {
        if (!value) return true;
        return !ReservationValidator.isEmptyString(value);
      }),
    defaultValue: undefined,
  },
  subject_id: {
    validator: yup
      .number()
      .notRequired()
      .nullable()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test(
        'have-valid-reservation-type',
        `O tipo de reserva deve ser "Prova"`,
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type !== ReservationType.EXAM) {
            if (!value) return true;
            return false;
          }
          return true;
        },
      )
      .test(
        'is-valid-link',
        `É necessário escolher uma disciplina`,
        function (value) {
          if (!value) return false;
          return !ReservationValidator.isInvalidId(value);
        },
      ),
    defaultValue: undefined,
  },
  class_ids: {
    validator: yup
      .array(yup.number())
      .notRequired()
      .test(
        'have-valid-reservation-type',
        `O tipo de reserva deve ser "Reunião" ou "Evento"`,
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type !== ReservationType.EXAM) {
            if (value !== undefined) return false;
            return true;
          }
          return true;
        },
      )
      .test('is-valid-link', `Campo inválido`, function (value) {
        if (!value) return true;
        if (value.length === 0) return true;
        return !ReservationValidator.isInvalidIdArray(
          value.filter((id) => id !== undefined),
        );
      }),
    defaultValue: undefined,
  },
  event_type: {
    validator: yup
      .string()
      .nullable()
      .test(
        'have-valid-reservation-type',
        `O tipo de reserva deve ser "Reunião" ou "Evento"`,
        function (value) {
          const { type } = this.parent;
          if (!type) return false;
          if (type !== ReservationType.EVENT) {
            if (value !== undefined) return false;
            return true;
          }
          return true;
        },
      )
      .test('is-valid-link', `Campo inválido`, function (value) {
        if (!value) return true;
        return !ReservationValidator.isEmptyString(value);
      }),
    defaultValue: undefined,
  },
};

export const firstSchema = yup.object<ReservationFirstForm>().shape({
  title: formFields.title.validator,
  type: formFields.type.validator,
  reason: formFields.reason.validator,
  link: formFields.link.validator,
  subject_id: formFields.subject_id.validator,
  class_ids: formFields.class_ids.validator,
  event_type: formFields.event_type.validator,
});

export const firstDefaultValues: ReservationFirstForm = {
  title: formFields.title.defaultValue,
  type: formFields.type.defaultValue as ReservationType,
  reason: formFields.reason.defaultValue,
  link: formFields.link.defaultValue,
  subject_id: formFields.subject_id.defaultValue,
  class_ids: formFields.class_ids.defaultValue,
  event_type: formFields.event_type.defaultValue,
};
