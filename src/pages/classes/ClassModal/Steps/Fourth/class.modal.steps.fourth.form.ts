import * as yup from 'yup';
import { ClassFourthForm } from './class.modal.steps.fourth.interface';
import { ClassValidator } from '../../../../../utils/classes/classes.validator';
import { AudiovisualType } from '../../../../../utils/enums/audiovisualType.enum';

export const classFourthFormFields = {
  ignore_to_allocate: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  audiovisual: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('valid-audiovisual', 'Recuso audiovisual inválido', (value) => {
        return !ClassValidator.isInvalidAudiovisualType(value);
      }),
    defaultValue: AudiovisualType.NONE,
  },
  air_conditionating: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const classFourthchema = yup.object<ClassFourthForm>().shape({
  ignore_to_allocate: classFourthFormFields.ignore_to_allocate.validator,
  audiovisual: classFourthFormFields.audiovisual.validator,
  air_conditionating: classFourthFormFields.air_conditionating.validator,
  accessibility: classFourthFormFields.accessibility.validator,
});

export const classFourthDefaultValues: ClassFourthForm = {
  ignore_to_allocate: classFourthFormFields.ignore_to_allocate.defaultValue,
  audiovisual: classFourthFormFields.audiovisual.defaultValue as AudiovisualType,
  air_conditionating: classFourthFormFields.air_conditionating.defaultValue,
  accessibility: classFourthFormFields.accessibility.defaultValue,
};
