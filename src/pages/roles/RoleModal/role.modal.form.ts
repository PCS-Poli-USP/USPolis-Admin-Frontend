import * as yup from 'yup';
import { RoleForm } from './role.modal.interface';

export const schema = yup.object<RoleForm>().shape({
  name: yup
    .string()
    .required('Campo obrigatório')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  description: yup.string().max(255, 'Máximo de 255 caracteres'),
});

export const defaultValues: RoleForm = {
  name: '',
  description: '',
};

