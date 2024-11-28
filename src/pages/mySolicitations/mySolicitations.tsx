import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import DataTable from 'components/common/DataTable/dataTable.component';
import { getMySolicitationsColumns } from './Tables/mySolicitations.table';
import PageContent from 'components/common/PageContent';
import { UserResponse } from 'models/http/responses/user.response.models';
import useUsers from 'hooks/useUsers';
import { CloseIcon } from '@chakra-ui/icons';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import SolicitationStack from './MySolicitationStack/mysolicitation.stack';
import MySolicitationModal from './MySolicitationModal/mysolicitation.modal';

const MySolicitations = () => {
  // const { loggedUser } = useContext(appContext);
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { getSelf } = useUsers(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse>();

  const [hiddenAlert, setHiddenAlert] = useState(false);
  const [selectedSolicitation, setSelectedSolicitation] =
    useState<ClassroomSolicitationResponse>();
  const { isOpen, onClose, onToggle } = useDisclosure();

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
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <VStack alignItems={'flex-start'} spacing={2} mb={2}>
          <Text fontSize='4xl'>Minhas solicitações</Text>
          <HStack>
            <Alert status='info' hidden={hiddenAlert}>
              <AlertIcon color={'blue'} />O resultado das solicitações e suas
              justificativas chegam por email, verifique sua caixa de spam.
              <IconButton
                icon={<CloseIcon />}
                aria-label='close-alert'
                size={'sm'}
                variant={'ghost'}
                onClick={() => setHiddenAlert(true)}
              />
            </Alert>
          </HStack>
        </VStack>
      </Flex>
      <Skeleton isLoaded={!!loggedUser}>
        {!isMobile ? (
          <DataTable
            columns={columns}
            data={loggedUser ? loggedUser?.solicitations : []}
          />
        ) : (
          <Box w={'100%'} h={'full'}>
            <SolicitationStack
              solicitations={loggedUser ? loggedUser.solicitations : []}
              handleOnClick={(data) => {
                setSelectedSolicitation(data);
                onToggle();
              }}
              reset={() => setSelectedSolicitation(undefined)}
            />
            <MySolicitationModal
              solicitation={selectedSolicitation}
              isOpen={isOpen}
              onClose={onClose}
            />
          </Box>
        )}
      </Skeleton>
    </PageContent>
  );
};

export default MySolicitations;
