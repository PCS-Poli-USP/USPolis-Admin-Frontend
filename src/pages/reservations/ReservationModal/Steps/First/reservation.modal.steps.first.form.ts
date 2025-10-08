import * as yup from 'yup';
import { ReservationValidator } from '../../../../../utils/reservations/resevations.validator';
import { ReservationFirstForm } from './reservation.modal.steps.first.interface';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { normalizeURL } from '../../../../../utils/formatters';

export const formFields = {
  is_solicitation: {
    validator: yup
      .boolean()
      .required('Necessário informar se é uma solicitação'),
    defaultValue: false,
  },
  capacity: {
    validator: yup
      .number()
      .notRequired()
      .test(
        'solicitation-capacity-check',
        'Capacidade deve ser informada apenas em solicitações',
        function (value) {
          const { is_solicitation } = this.parent as ReservationFirstForm;
          if (is_solicitation) return true;
          if (!is_solicitation && value != undefined) return false;
          return true;
        },
      )
      .test('is-valid-capacity', 'Campo obrigatório', function (value) {
        const { is_solicitation } = this.parent as ReservationFirstForm;
        if (is_solicitation && !value) return false;
        return true;
      }),
    defaultValue: undefined,
  },
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
      .transform((curr, orig) => (orig === '' ? undefined : normalizeURL(curr))) // Yup treats notRequired as ''
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
      .test('is-valid-link', `URL inválida`, function (value) {
        const { type } = this.parent;
        if (type == ReservationType.EXAM) return true;
        if (!value) return true;
        return ReservationValidator.isValidURL(value);
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
          const { type } = this.parent;
          if (type != ReservationType.EXAM) return true;
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
        `O tipo de reserva deve ser "Prova"`,
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
        `O tipo de reserva deve ser "Evento"`,
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
      .test(
        'is-valid-link',
        `É necessário escolher um tipo!`,
        function (value) {
          const { type } = this.parent;
          if (type !== ReservationType.EVENT) return true;
          if (!value) return false;
          return !ReservationValidator.isEmptyString(value);
        },
      ),
    defaultValue: undefined,
  },
};

export const firstSchema = yup.object<ReservationFirstForm>().shape({
  is_solicitation: formFields.is_solicitation.validator,
  capacity: formFields.capacity.validator,
  title: formFields.title.validator,
  type: formFields.type.validator,
  reason: formFields.reason.validator,
  link: formFields.link.validator,
  subject_id: formFields.subject_id.validator,
  class_ids: formFields.class_ids.validator,
  event_type: formFields.event_type.validator,
});

export const firstDefaultValues: ReservationFirstForm = {
  is_solicitation: formFields.is_solicitation.defaultValue,
  capacity: formFields.capacity.defaultValue,
  title: formFields.title.defaultValue,
  type: formFields.type.defaultValue as ReservationType,
  reason: formFields.reason.defaultValue,
  link: formFields.link.defaultValue,
  subject_id: formFields.subject_id.defaultValue,
  class_ids: formFields.class_ids.defaultValue,
  event_type: formFields.event_type.defaultValue,
};
