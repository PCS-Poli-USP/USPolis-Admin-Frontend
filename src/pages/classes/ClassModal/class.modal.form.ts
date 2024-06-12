import { ClassValidator } from 'utils/classes/classes.validator';
import * as yup from 'yup';
import { ClassForm } from './class.modal.interface';

export const classFormFields = {
  subject_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-id',
        'Escolha uma disciplina válida',
        (value) => !ClassValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  code: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Código deve conter 7 caracteres',
        (value) => !ClassValidator.isInvalidClassCode(value),
      ),
    defaultValue: '',
  },
  type: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Tipo inválido',
        (value) => !ClassValidator.isInvalidClassType(value),
      ),
    defaultValue: '',
  },
  professors: {
    validator: yup
      .array()
      .of(yup.string().required('Campo obrigatório'))
      .min(1, 'Coloque pelo menos um professor')
      .test(
        'is-valid-array',
        'Professores inválidos',
        (value) => value && !ClassValidator.isInvalidProfessorList(value),
      ),
    defaultValue: [],
  },
  start_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data inválida',
        (value) => !ClassValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data inválida',
        (value) => !ClassValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  calendar_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(1, 'Selecione pelo menos um calendário')
      .test(
        'is-valid-option',
        'Calendários invalidos',
        (value) => value && !ClassValidator.isInvalidIdArray(value),
      ),
    defaultValue: [],
  },
  vacancies: {
    validator: yup
      .number()
      .min(0, 'Vagas não pode ser negativa')
      .required('Campo obrigatório'),
    defaultValue: 0,
  },
  subscribers: {
    validator: yup
      .number()
      .min(0, 'Inscritos não pode ser negativo')
      .required('Campo obrigatório'),
    defaultValue: 0,
  },

  pendings: {
    validator: yup
      .number()
      .min(0, 'Pendentes não pode ser negativo')
      .required('Campo obrigatório')
      .test(
        'is-greater',
        'Número de inscritos deve ser maior ou igual ao de pendentes',
        function (value) {
          const { subscribers } = this.parent;
          return subscribers >= value;
        },
      ),
    defaultValue: 0,
  },
  air_conditioning: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  projector: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  ignore_to_allocate: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const classSchema = yup.object<ClassForm>().shape({
  subject_id: classFormFields.subject_id.validator,
  code: classFormFields.code.validator,
  type: classFormFields.type.validator,
  professors: classFormFields.professors.validator,
  start_date: classFormFields.start_date.validator,
  end_date: classFormFields.end_date.validator,
  calendar_ids: classFormFields.calendar_ids.validator,
  vacancies: classFormFields.vacancies.validator,
  subscribers: classFormFields.subscribers.validator,
  pendings: classFormFields.pendings.validator,
  air_conditioning: classFormFields.air_conditioning.validator,
  projector: classFormFields.projector.validator,
  accessibility: classFormFields.accessibility.validator,
  ignore_to_allocate: classFormFields.ignore_to_allocate.validator,
});

export const classDefaultValues: ClassForm = {
  subject_id: classFormFields.subject_id.defaultValue,
  code: classFormFields.code.defaultValue,
  type: classFormFields.type.defaultValue,
  professors: classFormFields.professors.defaultValue,
  start_date: classFormFields.start_date.defaultValue,
  end_date: classFormFields.end_date.defaultValue,
  calendar_ids: classFormFields.calendar_ids.defaultValue,
  vacancies: classFormFields.vacancies.defaultValue,
  subscribers: classFormFields.subscribers.defaultValue,
  pendings: classFormFields.pendings.defaultValue,
  air_conditioning: classFormFields.air_conditioning.defaultValue,
  projector: classFormFields.projector.defaultValue,
  accessibility: classFormFields.accessibility.defaultValue,
  ignore_to_allocate: classFormFields.ignore_to_allocate.defaultValue,
};
