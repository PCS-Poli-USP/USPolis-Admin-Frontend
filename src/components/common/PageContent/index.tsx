import React, { ReactNode } from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';

interface PageContentProps {
  children?: ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex
      direction='column'
      width='100%'
      height='100%'
      // overflow={'auto'}
      // bg={'pink'}
      mt={'60px'}
    >
      <Center>
        <Box p={4} w={'100%'} h={'100%'}>
          {children}
        </Box>
      </Center>
    </Flex>
  );
};

export default PageContent;
