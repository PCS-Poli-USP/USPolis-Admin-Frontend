import * as yup from 'yup';
import { ReservationThirdForm } from './reservation.modal.steps.third.interface';
import CommonValidator from 'utils/common/common.validator';

export const thirdFormFields = {
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

export const thirdSchema = yup.object<ReservationThirdForm>().shape({
  has_solicitation: thirdFormFields.has_solicitation.validator,
  solicitation_id: thirdFormFields.solicitation_id.validator,
});

export const thirdDefaultValues: ReservationThirdForm = {
  solicitation_id: thirdFormFields.solicitation_id.defaultValue,
  has_solicitation: thirdFormFields.has_solicitation.defaultValue,
};
