import { Divider, Heading, VStack } from '@chakra-ui/react';
import { ClassModalThirdStepProps } from './class.modal.steps.third.interface';
import { FormProvider } from 'react-hook-form';
import { CheckBox } from 'components/common/form/CheckBox';

function ClassModalThirdStep(props: ClassModalThirdStepProps) {
  return (
    <VStack mt={5} width={'100%'} align={'stretch'} spacing={4}>
      <FormProvider {...props.form}>
        <form>
          <VStack align={'start'}>
            <Divider borderColor={'black'} />
            <Heading size={'lg'}>Preferências da Alocação</Heading>
            <CheckBox
              name={'ignore_to_allocate'}
              text={'Ignorar para alocação automática'}
            />
            <Divider borderColor={'black'} />

            <Heading size={'lg'}>Preferências da Sala</Heading>
            <CheckBox name={'projector'} text={'Projetor'} />
            <CheckBox name={'air_conditionating'} text={'Ar condicionado'} />
            <CheckBox name={'accessibility'} text={'Acessibilidade'} />
            <Divider borderColor={'black'} />
          </VStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalThirdStep;
