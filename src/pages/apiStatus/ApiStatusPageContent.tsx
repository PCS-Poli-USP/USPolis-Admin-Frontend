import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ApiStatusPageContentProps {
  children?: ReactNode;
  background: string;
}

// Variante de PageContent só para esta página: em vez de herdar o padding de
// PageContent e "sangrar" com margem negativa por cima dele, o fundo já nasce
// ocupando a área inteira (mesmas dimensões que PageContent usaria).
function ApiStatusPageContent({
  children,
  background,
}: ApiStatusPageContentProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return (
    <Flex
      direction='column'
      width='100%'
      height='calc(100vh - 60px)'
      mt={'60px'}
    >
      <Box
        position={'relative'}
        overflow={'hidden'}
        w={'100%'}
        h={'100%'}
        p={isMobile ? '8px' : '16px'}
        background={background}
      >
        {children}
      </Box>
    </Flex>
  );
}

export default ApiStatusPageContent;
