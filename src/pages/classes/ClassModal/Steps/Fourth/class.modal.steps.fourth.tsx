import { VStack, Text } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { CheckBox } from 'components/common/form/CheckBox';
import { ClassModalFourthStepProps } from './class.modal.steps.fourth.interface';

function ClassModalFourthStep(props: ClassModalFourthStepProps) {
  return (
    <VStack mt={5} width={'100%'} align={'stretch'} spacing={4}>
      <FormProvider {...props.form}>
        <form>
          <VStack align={'start'}>
            <Text as={'b'} fontSize={'lg'}>
              Preferências da Alocação
            </Text>
            <CheckBox
              name={'ignore_to_allocate'}
              text={'Ignorar para alocação automática'}
            />
            <Text as={'b'} fontSize={'lg'} mt={4}>
              Preferências da Sala
            </Text>
            <CheckBox name={'projector'} text={'Projetor'} />
            <CheckBox name={'air_conditionating'} text={'Ar condicionado'} />
            <CheckBox name={'accessibility'} text={'Acessibilidade'} />
          </VStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalFourthStep;
