import * as yup from 'yup';
import { ClassroomForm } from './classroom.modal.interface';
import { ClassroomValidator } from 'utils/classrooms/classrooms.validator';

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
  ignore_to_allocate: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  projector: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  air_conditioning: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const schema = yup.object<ClassroomForm>().shape({
  name: formFields.name.validator,
  building_id: formFields.building_id.validator,
  floor: formFields.floor.validator,
  capacity: formFields.capacity.validator,
  ignore_to_allocate: formFields.ignore_to_allocate.validator,
  air_conditioning: formFields.air_conditioning.validator,
  projector: formFields.projector.validator,
  accessibility: formFields.accessibility.validator,
});

export const defaultValues: ClassroomForm = {
  name: formFields.name.defaultValue,
  building_id: formFields.building_id.defaultValue,
  floor: formFields.floor.defaultValue,
  capacity: formFields.capacity.defaultValue,
  ignore_to_allocate: formFields.ignore_to_allocate.defaultValue,
  air_conditioning: formFields.air_conditioning.defaultValue,
  projector: formFields.projector.defaultValue,
  accessibility: formFields.accessibility.defaultValue,
};
