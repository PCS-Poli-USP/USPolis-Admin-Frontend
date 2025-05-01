import * as yup from 'yup';
import { GroupForm } from './group.modal.interface';
import GroupValidator from '../../../utils/groups/group.validator';

export const formFields = {
  building_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .transform((value) => {
        if (value === '') return 0;
        return value;
      })
      .test('is-valid-option', 'Campo obrigatório', (value) => {
        if (!value) return false;
        return !GroupValidator.isInvalidId(value);
      }),
    defaultValue: 0,
  },
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
      .test('is-valid-option', 'Selecione uma sala ou mais', function (value) {
        const { main } = this.parent;
        if (!value) return false;
        if (value.length === 0 && !main) return false;
        if (value.length === 0 && main) return true;
        return !GroupValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
  main: {
    validator: yup
      .boolean()
      .required('Campo obrigatório')
      .transform((value) => {
        if (value === '') return false;
        return value;
      }),
    defaultValue: false,
  },

  user_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Usuários inválidos', (value) => {
        if (!value) return false;
        if (value.length === 0) return true;
        return !GroupValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
};

export const schema = yup.object<GroupForm>().shape({
  building_id: formFields.building_id.validator,
  name: formFields.name.validator,
  classroom_ids: formFields.classroom_ids.validator,
  user_ids: formFields.user_ids.validator,
  main: formFields.main.validator,
});

export const defaultValues: GroupForm = {
  building_id: formFields.building_id.defaultValue,
  name: formFields.name.defaultValue,
  classroom_ids: formFields.classroom_ids.defaultValue,
  user_ids: formFields.user_ids.defaultValue,
  main: formFields.main.defaultValue,
};
