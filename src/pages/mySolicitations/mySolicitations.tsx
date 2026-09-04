import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Skeleton,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect, useMemo, useState } from 'react';

import PageContent from '../../components/common/PageContent';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../../utils/enums/reservations.enum';
import MySolicitationFilters, {
  SolicitationFilter,
} from './MySolicitationFilters/mysolicitation.filters';
import MySolicitationList from './MySolicitationList/mysolicitation.list';
import MySolicitationDetail from './MySolicitationDetail/mysolicitation.detail';
import useSolicitations from '../../hooks/solicitations/useSolicitations';
import Dialog from '../../components/common/Dialog/dialog.component';
import useBuildings from '../../hooks/useBuildings';
import useClassrooms from '../../hooks/classrooms/useClassrooms';
import ReservationModal from '../reservations/ReservationModal/reservation.modal';
import useSubjects from '../../hooks/useSubjetcts';

function filterSolicitations(
  solicitations: SolicitationResponse[],
  filter: SolicitationFilter,
  query: string,
) {
  const q = query.trim().toLowerCase();
  return solicitations.filter((solicitation) => {
    if (filter !== 'all' && solicitation.status !== filter) return false;
    if (!q) return true;
    const haystack = `${solicitation.reservation.title} ${solicitation.building} ${
      solicitation.reservation.classroom_name || ''
    }`.toLowerCase();
    return haystack.includes(q);
  });
}

const MySolicitations = () => {
  const { loading, solicitations, cancelSolicitation, getSolicitations } =
    useSolicitations();

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
  const {
    loading: loadingSubjects,
    subjects,
    getAllSubjectsActives,
  } = useSubjects(false);

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

  const {
    isOpen: isOpenDetail,
    onClose: onCloseDetail,
    onOpen: onOpenDetail,
  } = useDisclosure();

  const [hiddenAlert, setHiddenAlert] = useState(false);

  // Record passed into the create/edit stepper (ReservationModal).
  const [modalTarget, setModalTarget] = useState<SolicitationResponse>();
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  // Record pending cancel confirmation.
  const [cancelTarget, setCancelTarget] = useState<SolicitationResponse>();

  // List selection driving the detail panel (desktop) / drawer (mobile).
  const [selectedId, setSelectedId] = useState<number>();

  const [filter, setFilter] = useState<SolicitationFilter>('all');
  const [query, setQuery] = useState('');

  function handleNewClick() {
    setModalTarget(undefined);
    setIsUpdateModal(false);
    onOpenSolicitation();
  }

  function handleEditClick(data: SolicitationResponse) {
    onCloseDetail();
    setModalTarget(data);
    setIsUpdateModal(true);
    onOpenSolicitation();
  }

  function handleRedoClick(data: SolicitationResponse) {
    onCloseDetail();
    setModalTarget(data);
    setIsUpdateModal(false);
    onOpenSolicitation();
  }

  function handleCancelClick(data: SolicitationResponse) {
    setCancelTarget(data);
    onOpenDialog();
  }

  function handleSelect(data: SolicitationResponse) {
    setSelectedId(data.id);
    if (isMobile) onOpenDetail();
  }

  useEffect(() => {
    getAllBuildings();
    getAllSubjectsActives();
    getAllClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (solicitations.length === 0) {
      setSelectedId(undefined);
      return;
    }
    if (selectedId && solicitations.some((s) => s.id === selectedId)) return;
    const firstPending = solicitations.find(
      (s) => s.status === ReservationStatus.PENDING,
    );
    setSelectedId((firstPending || solicitations[0]).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitations]);

  const counts = useMemo(() => {
    const result: Record<SolicitationFilter, number> = {
      all: solicitations.length,
      [ReservationStatus.PENDING]: 0,
      [ReservationStatus.APPROVED]: 0,
      [ReservationStatus.DENIED]: 0,
      [ReservationStatus.CANCELLED]: 0,
      [ReservationStatus.DELETED]: 0,
    };
    solicitations.forEach((s) => {
      result[s.status] = (result[s.status] || 0) + 1;
    });
    return result;
  }, [solicitations]);

  const visible = useMemo(
    () => filterSolicitations(solicitations, filter, query),
    [solicitations, filter, query],
  );

  const selected = solicitations.find((s) => s.id === selectedId);
  const pendingCount = counts[ReservationStatus.PENDING] || 0;

  return (
    <PageContent>
      <VStack
        align={'stretch'}
        spacing={{ base: '12px', md: '16px' }}
        maxW={'1440px'}
        mx={'auto'}
        w={'full'}
        h={isMobile ? 'auto' : 'full'}
        minH={0}
        overflow={isMobile ? 'visible' : 'hidden'}
      >
        <Flex flexShrink={0} align={{ base: 'flex-start', sm: 'center' }} gap={'14px'} wrap={'wrap'}>
          <VStack align={'flex-start'} spacing={'2px'}>
            <Text fontSize={{ base: '24px', md: '32px' }} fontWeight={'normal'} color={'uspolis.text'} lineHeight={1.1}>
              Minhas solicitações
            </Text>
            <Text fontSize={{ base: '13px', md: '14px' }} color={'uspolis.textMuted'}>
              {`${pendingCount} ${
                pendingCount === 1 ? 'pedido aguardando resposta' : 'pedidos aguardando resposta'
              } · ${solicitations.length} no total`}
            </Text>
          </VStack>
          <Box flex={1} display={{ base: 'none', sm: 'block' }} />
          <Button
            borderRadius={'8px'}
            colorScheme={'blue'}
            leftIcon={<AddIcon boxSize={'10px'} />}
            onClick={handleNewClick}
            isLoading={loadingSubjects || loadingClassrooms || loadingBuildings}
            whiteSpace={'nowrap'}
            w={{ base: 'full', sm: 'auto' }}
          >
            Nova solicitação
          </Button>
        </Flex>

        <Alert flexShrink={0} status='info' borderRadius={'8px'} hidden={hiddenAlert} fontSize={{ base: '13px', md: '14px' }}>
          <AlertIcon />
          <Text flex={1}>
            O resultado das solicitações e suas justificativas também chegam por e-mail —
            verifique sua caixa de spam.
          </Text>
          <IconButton
            icon={<CloseIcon boxSize={'10px'} />}
            aria-label='close-alert'
            size={'sm'}
            variant={'ghost'}
            onClick={() => setHiddenAlert(true)}
          />
        </Alert>

        <Box flexShrink={0}>
          <MySolicitationFilters
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
            query={query}
            onQueryChange={setQuery}
          />
        </Box>

        <Dialog
          title={'Cancelar Solicitação'}
          isOpen={isOpenDialog}
          onClose={onCloseDialog}
          warningText='Uma vez cancelada, a solicitação não poderá ser reaberta.'
          onConfirm={async () => {
            if (!cancelTarget) return;
            onCloseDialog();
            await cancelSolicitation(cancelTarget.id);
            setCancelTarget(undefined);
          }}
        />

        <ReservationModal
          onClose={() => {
            setModalTarget(undefined);
            onCloseSolicitation();
          }}
          isOpen={isOpenSolicitation}
          isUpdate={isUpdateModal}
          isSolicitation={true}
          classrooms={classrooms}
          buildings={buildings}
          selectedReservation={modalTarget?.reservation}
          selectedSolicitation={modalTarget}
          refetch={async () => {
            await getSolicitations();
            setModalTarget(undefined);
          }}
          subjects={subjects}
          loading={loadingSubjects || loadingClassrooms || loadingBuildings}
        />

        <Drawer isOpen={isOpenDetail} onClose={onCloseDetail} placement={'bottom'} size={'full'}>
          <DrawerOverlay />
          <DrawerContent bg={'uspolis.white'} borderTopRadius={'16px'} maxH={'92vh'}>
            <DrawerCloseButton />
            <DrawerBody px={'16px'} pt={'40px'} pb={'16px'}>
              <MySolicitationDetail
                embedded
                solicitation={selected}
                onEditClick={handleEditClick}
                onCancelClick={(data) => {
                  onCloseDetail();
                  handleCancelClick(data);
                }}
                onRedoClick={handleRedoClick}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Skeleton
          isLoaded={!loading}
          flex={isMobile ? undefined : 1}
          minH={isMobile ? undefined : 0}
          overflow={isMobile ? 'visible' : 'hidden'}
        >
          <Grid
            h={isMobile ? 'auto' : 'full'}
            templateColumns={isMobile ? '1fr' : 'minmax(0, 1fr) 520px'}
            gap={{ base: '14px', md: '20px' }}
            alignItems={isMobile ? 'flex-start' : 'stretch'}
          >
            <GridItem minW={0} overflow={isMobile ? 'visible' : 'hidden'}>
              <Box
                h={isMobile ? 'auto' : 'full'}
                overflowY={isMobile ? 'visible' : 'auto'}
                pr={isMobile ? undefined : '4px'}
              >
                <MySolicitationList
                  solicitations={visible}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  onEditClick={handleEditClick}
                  onCancelClick={handleCancelClick}
                  onNewClick={handleNewClick}
                />
              </Box>
            </GridItem>
            {!isMobile && (
              <GridItem overflow={'hidden'}>
                <MySolicitationDetail
                  solicitation={selected}
                  onEditClick={handleEditClick}
                  onCancelClick={handleCancelClick}
                  onRedoClick={handleRedoClick}
                />
              </GridItem>
            )}
          </Grid>
        </Skeleton>
      </VStack>
    </PageContent>
  );
};

export default MySolicitations;
