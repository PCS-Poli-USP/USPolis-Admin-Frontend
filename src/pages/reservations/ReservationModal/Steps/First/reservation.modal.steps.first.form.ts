import * as yup from 'yup';
import { ReservationValidator } from 'utils/reservations/resevations.validator';
import { ReservationFirstForm } from './reservation.modal.steps.first.interface';
import { ReservationType } from 'utils/enums/reservations.enum';

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
};

export const firstSchema = yup.object<ReservationFirstForm>().shape({
  title: formFields.title.validator,
  type: formFields.type.validator,
  reason: formFields.reason.validator,
});

export const firstDefaultValues: ReservationFirstForm = {
  title: formFields.title.defaultValue,
  type: formFields.type.defaultValue as ReservationType,
  reason: formFields.reason.defaultValue,
};
