import { Text, VStack } from '@chakra-ui/react';
import { ClassModalFourthStepProps } from './class.modal.steps.fourth.interface';

function ClassModalFourthStep(props: ClassModalFourthStepProps) {
  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <Text as='b' fontSize={'lg'}>
        Revisão
      </Text>
    </VStack>
  );
}

export default ClassModalFourthStep;
