import * as yup from 'yup';
import { EventForm } from '.';
import moment from 'moment';
import { EventTypes } from 'models/enums/eventTypes.enum';

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
  start_datetime: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid', 'Data inválida', (value) => moment(value).isValid()),
    defaultValue: '',
  },
  end_datetime: {
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

export const schema = yup.object<EventForm>().shape(
  {
    building: formFields.building.validator,
    classroom: formFields.classroom.validator,
    category: formFields.category.validator,
    description: formFields.description.validator,
    external_link: formFields.external_link.validator,
    location: formFields.location.validator,
    title: formFields.title.validator,
    start_datetime: formFields.start_datetime.validator,
    end_datetime: formFields.end_datetime.validator,
  },
  [['location', 'building']],
);

export const defaultValues: EventForm = {
  building: formFields.building.defaultValue as string | null,
  classroom: formFields.classroom.defaultValue as string | null,
  category: formFields.category.defaultValue,
  description: formFields.description.defaultValue,
  external_link: formFields.external_link.defaultValue,
  location: formFields.location.defaultValue as string | null,
  title: formFields.title.defaultValue,
  start_datetime: formFields.start_datetime.defaultValue,
  end_datetime: formFields.end_datetime.defaultValue,
};
