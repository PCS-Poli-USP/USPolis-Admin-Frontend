import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { FaLock } from 'react-icons/fa';

function Page401() {
  return (
    <PageContent>
      <Flex
        gap={'40px'}
        height='calc(100vh - 100px)'
        direction={'column'}
        justify={'flex-start'}
        align={'center'}
        margin={'0 auto 0 auto'}
      >
        <FaLock size={'128px'} />
        <Heading size={'3xl'}>Usuário não autorizado</Heading>
        <Text fontSize={'2xl'} textAlign={'center'}>
          Você não tem permissão para acessar essa página.
        </Text>
      </Flex>
    </PageContent>
  );
}

export default Page401;
