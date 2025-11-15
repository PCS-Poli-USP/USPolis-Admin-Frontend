import * as yup from 'yup';
import { BugPriority, BugType } from '../../../../utils/enums/bugReport.enum';
import { BugReportForm } from './bug.report.interface';

export const formFields = {
  priority: {
    validator: yup
      .mixed()
      .oneOf(BugPriority.values(), 'Prioridade inválida')
      .required('Campo obrigatório'),
    defaultValue: '',
  },
  type: {
    validator: yup
      .mixed()
      .oneOf(BugType.values(), 'Tipo inválido')
      .required('Campo obrigatório'),
    defaultValue: '',
  },
  description: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-description', 'Descrição inválida', (value) => !!value),
    defaultValue: '',
  },
};

export const schema = yup.object<BugReportForm>().shape({
  priority: formFields.priority.validator,
  type: formFields.type.validator,
  description: formFields.description.validator,
});

export const defaultValues: BugReportForm = {
  priority: formFields.priority.defaultValue as BugPriority,
  type: formFields.type.defaultValue as BugType,
  description: formFields.description.defaultValue,
};
