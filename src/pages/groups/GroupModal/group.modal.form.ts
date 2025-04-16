import * as yup from 'yup';
import { GroupForm } from './group.modal.interface';
import GroupValidator from 'utils/groups/group.validator';

export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !GroupValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },

  classroom_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Salas invalidas', (value) => {
        if (!value) return true;
        if (value.length === 0) return true;
        return !GroupValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },

  user_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Usuários invalidas', (value) => {
        if (!value) return true;
        return !GroupValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
};

export const schema = yup.object<GroupForm>().shape({
  name: formFields.name.validator,
  classroom_ids: formFields.classroom_ids.validator,
  user_ids: formFields.user_ids.validator,
});

export const defaultValues: GroupForm = {
  name: formFields.name.defaultValue,
  classroom_ids: formFields.classroom_ids.defaultValue,
  user_ids: formFields.user_ids.defaultValue,
};
