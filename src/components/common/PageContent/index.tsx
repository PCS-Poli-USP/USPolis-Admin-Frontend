import React, { ReactNode } from 'react';
import { Box, Center, Flex, useMediaQuery } from '@chakra-ui/react';

interface PageContentProps {
  children?: ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  return (
    <Flex
      direction='column'
      width='100%'
      height='calc(100vh - 60px)'
      // overflow={'auto'}
      mt={'60px'}
    >
      <Center>
        <Box p={isMobile ? '8px' : '16px'} w={'100%'} h={'100%'}>
          {children}
        </Box>
      </Center>
    </Flex>
  );
};

export default PageContent;
