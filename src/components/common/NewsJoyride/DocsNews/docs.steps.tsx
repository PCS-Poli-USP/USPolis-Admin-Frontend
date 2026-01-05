import { Flex, Icon, Text } from '@chakra-ui/react';
import createFeatureTourGuideStep from '../../../../context/FeatureGuideContext/steps';
import FingerClick from '../../Animation/FingerClick';
import { GrDocumentText } from 'react-icons/gr';

function createDocsIntroductionStep(isMobile: boolean) {
  return createFeatureTourGuideStep({
    target: '#docs-button',
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
          Documentação
        </Text>
        <Text size={'md'}>Teve alguma dúvida ao usar o sistema?</Text>
        <Text>Veja nossa documentação!</Text>
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
            <Text>{isMobile ? '' : 'Documentação'}</Text>
            <Icon as={GrDocumentText} />
          </Flex>
          <FingerClick />
        </Flex>
      </Flex>
    ),
  });
}

export function createDocsSteps(isMobile: boolean) {
  return [createDocsIntroductionStep(isMobile)];
}
