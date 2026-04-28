export interface TimetableCrawlForm {
  nusp: string;
  password: string;
}

export const defaultValues: TimetableCrawlForm = {
  nusp: '',
  password: '',
};

import * as yup from 'yup';

export const schema = yup.object<TimetableCrawlForm>().shape({
  nusp: yup
    .string()
    .matches(/^\d+$/, 'Número USP deve conter apenas números')
    .required('Número USP é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});
