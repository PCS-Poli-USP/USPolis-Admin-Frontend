import { Flex, Text } from '@chakra-ui/react';

interface PageHeaderProps {
  title: string;
}

function PageHeader({ title }: PageHeaderProps) {
  return (
    <Flex
      direction={'row'}
      gap={'20px'}
      align={'center'}
      h={'60px'}
      alignSelf={'center'}
      justifySelf={'center'}
      mb={'10px'}
    >
      <Text fontSize='4xl'>{title}</Text>
    </Flex>
  );
}

export default PageHeader;
