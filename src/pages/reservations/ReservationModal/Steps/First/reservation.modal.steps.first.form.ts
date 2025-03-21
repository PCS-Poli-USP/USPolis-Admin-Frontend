import * as yup from 'yup';
import { ReservationValidator } from 'utils/reservations/resevations.validator';
import { ReservationFirstForm } from './reservation.modal.steps.first.interface';
import { ReservationType } from 'utils/enums/reservations.enum';
import CommonValidator from 'utils/common/common.validator';

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
  solicitation_id: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : Number(curr)))
      .test('is-valid-id', 'Selecione uma solicitação', function (value) {
        const has = this.parent.has_solicitation;
        if (!has) {
          if (value) return false;
          return true;
        } else {
          if (!value) return false;
          return !CommonValidator.isInvalidId(value);
        }
      }),
    defaultValue: undefined,
  },
  has_solicitation: {
    validator: yup.boolean().required('Selecione uma opção'),
    defaultValue: false,
  },
};

export const firstSchema = yup.object<ReservationFirstForm>().shape({
  title: formFields.title.validator,
  type: formFields.type.validator,
  reason: formFields.reason.validator,
  has_solicitation: formFields.has_solicitation.validator,
  solicitation_id: formFields.solicitation_id.validator,
});

export const firstDefaultValues: ReservationFirstForm = {
  title: formFields.title.defaultValue,
  type: formFields.type.defaultValue as ReservationType,
  reason: formFields.reason.defaultValue,
  solicitation_id: formFields.solicitation_id.defaultValue,
  has_solicitation: formFields.has_solicitation.defaultValue,
};
