import { Flex, HStack, Text, useMediaQuery, VStack } from '@chakra-ui/react';
import DataTable from '../../components/common/DataTable/dataTable.component';
import PageContent from '../../components/common/PageContent';
import useOnlineUsersSocket from '../../hooks/onlineUsers/useOnlineUsersSocket';
import { getOnlineUsersColumns } from './Tables/onlineUsers.table';
import OnlineUsersStack from './OnlineUsersStack/onlineUsers.stack';
import PulseDot from './PulseDot';

function OnlineUsers() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { connections } = useOnlineUsersSocket();
  const columns = getOnlineUsersColumns();

  return (
    <PageContent>
      <Flex
        align={'baseline'}
        justify={'space-between'}
        gap={'12px'}
        wrap={'wrap'}
        mb={'20px'}
      >
        <VStack align={'flex-start'} spacing={0}>
          <Text
            fontSize={isMobile ? '2xl' : '4xl'}
            fontWeight={'bold'}
            color={'uspolis.black'}
          >
            Usuários online
          </Text>
          <Text fontSize={'sm'} color={'uspolis.gray'}>
            Atualização em tempo real via WebSocket
          </Text>
        </VStack>
        <HStack
          bg={'uspolis.lightBlue'}
          border={'1px solid'}
          borderColor={'uspolis.blue'}
          borderRadius={'20px'}
          px={'14px'}
          py={'6px'}
          spacing={'8px'}
        >
          <PulseDot />
          <Text
            fontSize={'sm'}
            fontWeight={'medium'}
            color={'uspolis.darkBlue'}
          >
            {`${connections.length} conectado${connections.length === 1 ? '' : 's'}`}
          </Text>
        </HStack>
      </Flex>

      {!isMobile ? (
        connections.length > 0 ? (
          <DataTable columns={columns} data={connections} />
        ) : (
          <Text textAlign={'center'} py={'48px'} color={'uspolis.gray'}>
            Nenhum usuário online agora.
          </Text>
        )
      ) : (
        <OnlineUsersStack connections={connections} />
      )}
    </PageContent>
  );
}

export default OnlineUsers;
