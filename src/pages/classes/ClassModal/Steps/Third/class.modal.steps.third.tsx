import { Text, VStack } from '@chakra-ui/react';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import { ClassModalThirdStepProps, ClassThirdForm } from './class.modal.steps.third.interface';
import {
  classThirdDefaultValues,
  classThirdSchema,
} from './class.modal.steps.third.form';

function ClassModalThirdStep(props: ClassModalThirdStepProps) {
  const classForm = useForm<ClassThirdForm>({
    defaultValues: classThirdDefaultValues,
    resolver: yupResolver(classThirdSchema),
  });

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...classForm}>
        <form>
          <Text as='b' fontSize={'lg'}>
            Preferências
          </Text>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalThirdStep;
