import * as yup from 'yup';
import moment from 'moment';
import { EventTypes } from '../../../utils/enums/eventTypes.enum';
import { InstitutionalEventForm } from './institutionalEvent.modal.interface';

export const formFields = {
  building: {
    validator: yup
      .string()
      .nullable()
      .when('location', ([location], s) =>
        !location ? s.required('Necessário informar local do evento') : s,
      ),
    defaultValue: '',
  },
  classroom: {
    validator: yup
      .string()
      .nullable()
      .when('location', ([location], s) =>
        !location ? s.required('Necessário informar local do evento') : s,
      ),
    defaultValue: '',
  },
  category: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-option', 'Campo obrigatório', (value) =>
        Object.keys(EventTypes).includes(value),
      ),
    defaultValue: '',
  },
  description: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  external_link: {
    validator: yup.string().url('Link inválido'),
    defaultValue: '',
  },
  location: {
    validator: yup
      .string()
      .nullable()
      .when('building', ([building], s) =>
        !building ? s.required('Necessário informar local do evento') : s,
      ),
    defaultValue: '',
  },
  title: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  start: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid', 'Data inválida', (value) => moment(value).isValid()),
    defaultValue: '',
  },
  end: {
    validator: yup
      .string()
      .test(
        'is-valid',
        'Data inválida',
        (value) => !value || moment(value).isValid(),
      )
      .test(
        'is-after-start',
        'Data precisa ser posterior a data de início',
        (value, context) =>
          !value ||
          moment(value).isAfter(moment(context.parent['start_datetime'])),
      ),
    defaultValue: '',
  },
};

export const schema = yup.object<InstitutionalEventForm>().shape(
  {
    building: formFields.building.validator,
    classroom: formFields.classroom.validator,
    category: formFields.category.validator,
    description: formFields.description.validator,
    external_link: formFields.external_link.validator,
    location: formFields.location.validator,
    title: formFields.title.validator,
    start: formFields.start.validator,
    end: formFields.end.validator,
  },
  [['location', 'building']],
);

export const defaultValues: InstitutionalEventForm = {
  building: formFields.building.defaultValue,
  classroom: formFields.classroom.defaultValue,
  category: formFields.category.defaultValue,
  description: formFields.description.defaultValue,
  external_link: formFields.external_link.defaultValue,
  location: formFields.location.defaultValue,
  title: formFields.title.defaultValue,
  start: formFields.start.defaultValue,
  end: formFields.end.defaultValue,
};
