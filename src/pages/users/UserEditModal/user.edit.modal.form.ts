import * as yup from 'yup';
import { UserEditForm } from './user.edit.modal.interface';
import { UsersValidator } from '../../../utils/users/users.validator';

export const formFields = {
  is_admin: {
    validator: yup
      .boolean()
      .required('Campo obrigatório')
      .test('is-valid-option', 'Campo obrigatório', (value) => {
        if (value === undefined) return false;
        return true;
      }),
    defaultValue: false,
  },
  building_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Usuários invalidas', (value) => {
        if (!value) return true;
        if (value.length === 0) return true;
        return !UsersValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
  group_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Grupos inválidos', (value) => {
        if (!value) return true;
        if (value.length === 0) return true;
        return !UsersValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
  receive_emails: {
    validator: yup
      .boolean()
      .required('Campo obrigatório')
      .test('is-valid-option', 'Campo obrigatório', (value) => {
        if (value === undefined) return false;
        return true;
      }),
    defaultValue: true,
  },
};

export const schema = yup.object<UserEditForm>().shape({
  is_admin: formFields.is_admin.validator,
  building_ids: formFields.building_ids.validator,
  group_ids: formFields.group_ids.validator,
  receive_emails: formFields.receive_emails.validator,
});

export const defaultValues: UserEditForm = {
  is_admin: formFields.is_admin.defaultValue,
  building_ids: formFields.building_ids.defaultValue,
  group_ids: formFields.group_ids.defaultValue,
  receive_emails: formFields.receive_emails.defaultValue,
};
