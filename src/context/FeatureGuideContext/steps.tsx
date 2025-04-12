import { Flex, Heading, Text } from '@chakra-ui/react';
import { Placement } from 'react-joyride';

interface StepContentProps {
  title: string;
  description: string | JSX.Element;
  titleSize?: string;
  descriptionSize?: string;
  mb?: number | string;
  width?: string | number;
}

function StepContent({
  title,
  description,
  titleSize = 'md',
  descriptionSize = 'md',
  mb = undefined,
  width = undefined,
}: StepContentProps) {
  return (
    <Flex
      align={'center'}
      direction='column'
      gap={'10px'}
      p={'5px'}
      mb={mb}
      width={width}
      zIndex={1000000}
    >
      <Heading fontWeight={'bold'} size={titleSize}>
        {title}
      </Heading>
      <Text size={descriptionSize}>{description}</Text>
    </Flex>
  );
}

export interface FeatureTourGuideStepProps extends StepContentProps {
  target: string;
  placement?: Placement;
  offset?: number;
  isFixed?: boolean;
  mb?: number | string;
  content?: JSX.Element;
  data?: FeatureTourGuideStepData;
}

export interface FeatureTourGuideStepData {
  next?: string;
  previous?: string;
}

export interface FeatureTourGuideStep {
  target: string;
  disableBeacon?: boolean;
  placement?: Placement;
  styles: {
    options: {
      arrowColor: string;
      primaryColor: string;
      textColor: string;
      backgroundColor: string;
    };
  };
  spotlightClicks: boolean;
  offset: number;
  data: FeatureTourGuideStepData;
  isFixed: boolean;
  content: JSX.Element;
}

function createFeatureTourGuideStep({
  target,
  title,
  description,
  titleSize,
  descriptionSize,
  placement,
  offset = 10,
  isFixed = false,
  mb = undefined,
  content = undefined,
  width = undefined,
  data = {},
}: FeatureTourGuideStepProps): FeatureTourGuideStep {
  return {
    target: target,
    placement: placement,
    disableBeacon: true,
    styles: {
      options: {
        arrowColor: '#408080',
        primaryColor: '#79b1b1',
        textColor: '#fff',
        backgroundColor: '#408080',
      },
    },
    spotlightClicks: true,
    offset: offset,
    isFixed: isFixed,
    data: data,
    content: content ? (
      content
    ) : (
      <StepContent
        title={title}
        description={description}
        titleSize={titleSize}
        descriptionSize={descriptionSize}
        width={width}
        mb={mb}
      />
    ),
  };
}

export default createFeatureTourGuideStep;
