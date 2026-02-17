import * as yup from 'yup';
import { ClassroomForm } from './classroom.modal.interface';
import { ClassroomValidator } from '../../../utils/classrooms/classrooms.validator';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';

export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },
  building_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-building-id',
        'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  group_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(1, 'Selecione um grupo ou mais')
      .test('is-valid-option', 'Selecione um grupo ou mais', function (value) {
        if (!value) return false;
        if (value.length === 0) return false;
        return !ClassroomValidator.isInvalidIdArray(value);
      }),
    defaultValue: [] as number[],
  },
  floor: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-floor',
        'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidFloor(value),
      ),
    defaultValue: 0,
  },
  capacity: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-capacity',
        'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidCapacity(value),
      ),
    defaultValue: 0,
  },

  audiovisual: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('valid-audiovisual', 'Recuso audiovisual inválido', (value) => {
        return !ClassroomValidator.isInvalidAudiovisualType(value);
      }),
    defaultValue: AudiovisualType.NONE,
  },
  air_conditioning: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  observation: {
    validator: yup.string().optional(),
    defaultValue: '',
  },
  remote: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  laboratory: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  reservable: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: true,
  },

  restricted: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const schema = yup.object<ClassroomForm>().shape({
  name: formFields.name.validator,
  building_id: formFields.building_id.validator,
  group_ids: formFields.group_ids.validator,
  floor: formFields.floor.validator,
  capacity: formFields.capacity.validator,
  air_conditioning: formFields.air_conditioning.validator,
  audiovisual: formFields.audiovisual.validator,
  accessibility: formFields.accessibility.validator,
  observation: formFields.observation.validator,
  remote: formFields.remote.validator,
  laboratory: formFields.laboratory.validator,
  reservable: formFields.reservable.validator,
  restricted: formFields.restricted.validator,
});

export const defaultValues: ClassroomForm = {
  name: formFields.name.defaultValue,
  building_id: formFields.building_id.defaultValue,
  group_ids: formFields.group_ids.defaultValue,
  floor: formFields.floor.defaultValue,
  capacity: formFields.capacity.defaultValue,
  air_conditioning: formFields.air_conditioning.defaultValue,
  audiovisual: formFields.audiovisual.defaultValue,
  accessibility: formFields.accessibility.defaultValue,
  observation: formFields.observation.defaultValue,
  remote: formFields.remote.defaultValue,
  laboratory: formFields.laboratory.defaultValue,
  reservable: formFields.reservable.defaultValue,
  restricted: formFields.restricted.defaultValue,
};
