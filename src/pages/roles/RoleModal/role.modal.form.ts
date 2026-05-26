import * as yup from 'yup';
import { RoleForm } from './role.modal.interface';

export const schema = yup.object<RoleForm>().shape({
  name: yup
    .string()
    .required('Campo obrigatório')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  description: yup.string().max(255, 'Máximo de 255 caracteres'),
  permission_ids: yup
    .array()
    .of(yup.number())
    .test('valid-ids', 'IDs negativos não são permitidos', (value) => {
      if (!value) return true; // Permite que o campo seja opcional
      return value.every((id) => id != undefined && id >= 0);
    }),
});

export const defaultValues: RoleForm = {
  name: '',
  description: '',
  permission_ids: [],
};

