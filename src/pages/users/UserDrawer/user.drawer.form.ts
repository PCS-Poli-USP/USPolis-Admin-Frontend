import * as yup from 'yup';
import { UserDrawerForm } from './user.drawer.interface';
import { UsersValidator } from '../../../utils/users/users.validator';

export const formFields = {
  is_admin: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  group_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Papéis inválidos', (value) => {
        if (!value) return true;
        if (value.length === 0) return true;
        return !UsersValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
  receive_emails: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: true,
  },
};

export const schema = yup.object<UserDrawerForm>().shape({
  is_admin: formFields.is_admin.validator,
  group_ids: formFields.group_ids.validator,
  receive_emails: formFields.receive_emails.validator,
});

export const defaultValues: UserDrawerForm = {
  is_admin: formFields.is_admin.defaultValue,
  group_ids: formFields.group_ids.defaultValue,
  receive_emails: formFields.receive_emails.defaultValue,
};
