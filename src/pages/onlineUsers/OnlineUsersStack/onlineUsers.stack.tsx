import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import moment from 'moment';
import { OnlineConnection } from '../../../models/http/responses/onlineConnection.response.models';
import PulseDot from '../PulseDot';

interface OnlineUsersStackProps {
  connections: OnlineConnection[];
}

function OnlineUsersStack({ connections }: OnlineUsersStackProps) {
  if (connections.length === 0) {
    return (
      <Text textAlign={'center'} py={'40px'} color={'uspolis.gray'}>
        Nenhum usuário online agora.
      </Text>
    );
  }

  return (
    <VStack spacing={'10px'} align={'stretch'} w={'full'}>
      {connections.map((connection) => (
        <Box
          key={connection.connection_id}
          bg={'uspolis.white'}
          border={'1px solid'}
          borderColor={'uspolis.lightGray'}
          borderRadius={'10px'}
          p={'14px'}
        >
          <Flex justify={'space-between'} align={'flex-start'} gap={'8px'}>
            <Box>
              <Text fontWeight={'bold'} fontSize={'sm'} color={'uspolis.black'}>
                {connection.name || 'Anônimo'}
              </Text>
              <Text fontSize={'xs'} color={'uspolis.gray'}>
                {connection.email || connection.ip_address}
              </Text>
            </Box>
            <PulseDot mt={'4px'} />
          </Flex>
          <Flex
            justify={'space-between'}
            fontSize={'xs'}
            color={'uspolis.gray'}
            mt={'6px'}
          >
            <Text fontFamily={'ui-monospace, monospace'}>
              {connection.page || '-'}
            </Text>
            <Text>{moment(connection.connected_since).fromNow()}</Text>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
}

export default OnlineUsersStack;
