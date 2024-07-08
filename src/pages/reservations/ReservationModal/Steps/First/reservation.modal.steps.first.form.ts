import * as yup from 'yup';
import { ReservationValidator } from 'utils/reservations/resevations.validator';
import { ReservationFirstForm } from './reservation.modal.steps.first.interface';
import { ReservationType } from 'utils/enums/reservations.enum';

export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !ReservationValidator.isInvalidName(value),
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
  description: {
    validator: yup
      .string()
      .notRequired()
      .nullable()
      .test('is-valid-description', 'Campo obrigatório', function (value) {
        if (!value) return true;
        return !ReservationValidator.isEmptyString(value);
      }),
    defaultValue: undefined,
  },
};

export const firstSchema = yup.object<ReservationFirstForm>().shape({
  name: formFields.name.validator,
  type: formFields.type.validator,
  description: formFields.description.validator,
});

export const firstDefaultValues: ReservationFirstForm = {
  name: formFields.name.defaultValue,
  type: formFields.type.defaultValue as ReservationType,
  description: formFields.description.defaultValue,
};
