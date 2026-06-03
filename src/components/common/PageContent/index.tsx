import React, { ReactNode } from 'react';
import { Box, Center, Flex, useMediaQuery } from '@chakra-ui/react';

interface PageContentProps {
  children?: ReactNode;
  center?: boolean;
}

const PageContent: React.FC<PageContentProps> = ({
  children,
  center = false,
}) => {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  return (
    <Flex
      direction='column'
      width='100%'
      height='calc(100vh - 60px)'
      // overflow={'auto'}
      mt={'60px'}
    >
      <Box p={isMobile ? '8px' : '16px'} w={'100%'} h={'100%'}>
        {center && <Center>{children}</Center>}
        {!center && children}
      </Box>
    </Flex>
  );
};

export default PageContent;
