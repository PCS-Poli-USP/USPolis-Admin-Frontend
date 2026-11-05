import * as yup from 'yup';
import { ApiClientForm } from './apiClientModal.interface';

export const schema: yup.ObjectSchema<ApiClientForm> = yup.object({
  name: yup
    .string()
    .trim()
    .required('O nome é obrigatório.')
    .max(256, 'Máximo de 256 caracteres.'),
  organization: yup.string().defined(),
  contact_name: yup
    .string()
    .trim()
    .required('O nome do contato é obrigatório.')
    .max(256, 'Máximo de 256 caracteres.'),
  contact_email: yup
    .string()
    .trim()
    .required('O e-mail do contato é obrigatório.')
    .email('Informe um e-mail válido.'),
  description: yup.string().defined().max(256, 'Máximo de 256 caracteres.'),
});

export const defaultValues: ApiClientForm = {
  name: '',
  organization: '',
  contact_name: '',
  contact_email: '',
  description: '',
};
