import { Flex, Icon, Text } from '@chakra-ui/react';
import createFeatureTourGuideStep from '../../../../context/FeatureGuideContext/steps';
import FingerClick from '../../Animation/FingerClick';
import { LuMessageCircleMore } from 'react-icons/lu';

function createContactUsIntroductionStep(isMobile: boolean) {
  return createFeatureTourGuideStep({
    target: '#contact-us-button',
    title: '',
    description: '',
    placement: isMobile ? 'center' : 'bottom-end',
    isFixed: true,
    content: (
      <Flex
        align={'center'}
        direction='column'
        gap={'10px'}
        zIndex={1000000}
        p={'5px'}
        w={'250px'}
        // mr={isMobile ? '-100px' : '0px'}
      >
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Fale conosco
        </Text>
        <Text size={'md'}>Tem alguma sugestão ou comentário?</Text>
        <Text>Teve algum problema ao usar o USPolis?</Text>
        <Flex
          gap={'20px'}
          flexDirection={'row'}
          justify={'center'}
          align={'center'}
        >
          <Flex
            align={'center'}
            gap={'5px'}
            border={'1px'}
            borderRadius={'5px'}
            padding={'5px'}
          >
            <Text>{isMobile ? 'Contato' : 'Fale conosco'}</Text>
            <Icon as={LuMessageCircleMore} />
          </Flex>
          <FingerClick />
        </Flex>
      </Flex>
    ),
  });
}

function createContactUsViewRadioButtonStep(isMobile: boolean) {
  return createFeatureTourGuideStep({
    target: '#view-radio-button',
    title: 'Escolha um tipo',
    description:
      'Escolha o que deseja fazer, uma mensagem/sugestão ou reportar um problema.',
    placement: isMobile ? 'center' : 'bottom',
    isFixed: true,
    width: isMobile ? '300px' : undefined,
  });
}

export function createContactUsSteps(isMobile: boolean) {
  return [
    createContactUsIntroductionStep(isMobile),
    createContactUsViewRadioButtonStep(isMobile),
  ];
}
