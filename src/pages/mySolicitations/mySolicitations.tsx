import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  Skeleton,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import DataTable from 'components/common/DataTable/dataTable.component';
import { getMySolicitationsColumns } from './Tables/mySolicitations.table';
import PageContent from 'components/common/PageContent';
import { UserResponse } from 'models/http/responses/user.response.models';
import useUsers from 'hooks/useUsers';

const MySolicitations = () => {
  // const { loggedUser } = useContext(appContext);
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { getSelf } = useUsers(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse>();

  const columns = getMySolicitationsColumns({});

  useEffect(() => {
    const fetch = async () => {
      const self = await getSelf();
      setLoggedUser(self);
    };
    fetch();
  }, [getSelf]);

  return (
    <PageContent>
      {!isMobile ? (
        <>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <VStack alignItems={'flex-start'} spacing={2} mb={2}>
              <Text fontSize='4xl'>Minhas solicitações</Text>
              <HStack>
                <Alert status='info'>
                  <AlertIcon color={'blue'} />O resultado das solicitações e
                  suas justificativas chegam por email, verifique sua caixa de
                  spam.
                </Alert>
              </HStack>
            </VStack>
          </Flex>
          <Skeleton isLoaded={!!loggedUser}>
            <DataTable
              columns={columns}
              data={loggedUser ? loggedUser?.solicitations : []}
            />
          </Skeleton>{' '}
        </>
      ) : (
        <Box w={'100%'} h={'full'} bg={'red'}>
          <Text>Mobile</Text>
        </Box>
      )}
    </PageContent>
  );
};

export default MySolicitations;
