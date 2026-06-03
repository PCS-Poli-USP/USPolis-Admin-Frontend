import { Box, Flex, Text } from '@chakra-ui/react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  fontSize?: string;
  subtitleFontSize?: string;
  leftIcon?: React.ReactNode;
}

function PageHeader({
  title,
  subtitle,
  leftIcon,
  fontSize = '4xl',
  subtitleFontSize = 'xl',
}: PageHeaderProps) {
  return (
    <Flex
      direction={'row'}
      gap={'10px'}
      align={'center'}
      h={'60px'}
      alignSelf={'center'}
      justifySelf={'center'}
      mb={'10px'}
    >
      <Box height={'100%'} alignContent={'center'}>
        {leftIcon ? leftIcon : null}
      </Box>
      <Flex direction={'column'} gap={'0px'}>
        <Text fontSize={fontSize} fontWeight={'bold'}>
          {title}
        </Text>
        {subtitle && <Text fontSize={subtitleFontSize}>{subtitle}</Text>}
      </Flex>
    </Flex>
  );
}

export default PageHeader;
