import {
  Alert,
  AlertIcon,
  Box,
  Button,
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

import DataTable from '../../components/common/DataTable/dataTable.component';
import { getMySolicitationsColumns } from './Tables/mySolicitations.table';
import PageContent from '../../components/common/PageContent';
import { CloseIcon } from '@chakra-ui/icons';
import { ClassroomSolicitationResponse } from '../../models/http/responses/classroomSolicitation.response.models';
import SolicitationStack from './MySolicitationStack/mysolicitation.stack';
import MySolicitationModal from './MySolicitationModal/mysolicitation.modal';
import useClassroomsSolicitations from '../../hooks/classroomSolicitations/useClassroomSolicitations';
import Dialog from '../../components/common/Dialog/dialog.component';
import SolicitationModal from '../allocation/SolicitationModal/solicitation.modal';
import useBuildings from '../../hooks/useBuildings';
import useClassrooms from '../../hooks/classrooms/useClassrooms';

const MySolicitations = () => {
  const { loading, solicitations, cancelSolicitation, getSolicitations } =
    useClassroomsSolicitations();
  const {
    loading: loadingBuildings,
    buildings,
    getAllBuildings,
  } = useBuildings(false);
  const {
    loading: loadingClassrooms,
    classrooms,
    getAllClassrooms,
  } = useClassrooms(false);
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  const {
    isOpen: isOpenDialog,
    onClose: onCloseDialog,
    onOpen: onOpenDialog,
  } = useDisclosure();

  const {
    isOpen: isOpenSolicitation,
    onClose: onCloseSolicitation,
    onOpen: onOpenSolicitation,
  } = useDisclosure();

  const [hiddenAlert, setHiddenAlert] = useState(false);
  const [selectedSolicitation, setSelectedSolicitation] =
    useState<ClassroomSolicitationResponse>();
  const { isOpen, onClose, onToggle } = useDisclosure();

  function handleCancelClick(data: ClassroomSolicitationResponse) {
    setSelectedSolicitation(data);
    onOpenDialog();
  }

  const columns = getMySolicitationsColumns({ handleCancelClick });

  useEffect(() => {
    getAllBuildings();
    getAllClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <VStack alignItems={'flex-start'} spacing={2} mb={2} w={'full'}>
          <Flex
            direction={'row'}
            align={'center'}
            justifyContent={'space-between'}
            w={'full'}
          >
            <Text fontSize='4xl'>Minhas solicitações</Text>
            <Button
              borderRadius={'10px'}
              colorScheme='blue'
              onClick={() => onOpenSolicitation()}
            >
              Nova Solicitação
            </Button>
          </Flex>
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
      <Dialog
        title={'Cancelar Solicitação'}
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        warningText='Uma vez cancelada, a solicitação não poderá ser reaberta.'
        onConfirm={async () => {
          if (!selectedSolicitation) return;
          onCloseDialog();
          await cancelSolicitation(selectedSolicitation.id);
        }}
      />
      <SolicitationModal
        isMobile={isMobile}
        isOpen={isOpenSolicitation}
        onClose={onCloseSolicitation}
        buildings={buildings}
        classrooms={classrooms.filter((classroom) => classroom.reservable)}
        loadingBuildings={loadingBuildings}
        loadingClassrooms={loadingClassrooms}
        refetch={async () => {
          await getSolicitations();
        }}
      />
      <Skeleton isLoaded={!loading && !loadingBuildings && !loadingClassrooms}>
        {!isMobile ? (
          <DataTable
            columns={columns}
            data={solicitations}
            columnPinning={{
              left: ['status'],
              right: ['options'],
            }}
          />
        ) : (
          <Box w={'100%'} h={'full'} p={'5px'}>
            <SolicitationStack
              solicitations={solicitations}
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
