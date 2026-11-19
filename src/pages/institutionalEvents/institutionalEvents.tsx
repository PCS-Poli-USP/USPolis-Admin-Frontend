/* eslint-disable react-hooks/set-state-in-effect */
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from '../../components/common/DataTable/dataTable.component';
import InstitutionalEventCardList from './InstitutionalEventCardList';
import Dialog from '../../components/common/Dialog/dialog.component';
import { GoSync } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { getInstitutionalEventsColumns } from './Tables/institutionalEvent.table';
import { InstitutionalEventResponse } from '../../models/http/responses/instituionalEvent.response.models';
import useInstitutionalEvents from '../../hooks/useInstitutionalEvents';
import InstitutionalEventModal from './InstitutionalEventModal/institutionalEvent.modal';
import useBuildings from '../../hooks/useBuildings';
import PageContent from '../../components/common/PageContent';

function InstitutionalEvents() {
  const {
    isOpen: isOpenEventForm,
    onClose: onCloseEventForm,
    onOpen: onOpenEventForm,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  const [selectedEvent, setSelectedEvent] = useState<
    InstitutionalEventResponse | undefined
  >(undefined);

  const { buildings } = useBuildings();
  const { events, loading, getEvents, deleteEvent } = useInstitutionalEvents();

  const columns = getInstitutionalEventsColumns({
    handleEditInstitutionalEvent,
    handleDeleteInstitutionalEvent,
  });

  useEffect(() => {
    if (!isOpenEventForm) setSelectedEvent(undefined);
  }, [isOpenEventForm]);

  useEffect(() => {
    if (!isOpenDelete) setSelectedEvent(undefined);
  }, [isOpenDelete]);

  function handleEditInstitutionalEvent(data: InstitutionalEventResponse) {
    setSelectedEvent(data);
    onOpenEventForm();
  }

  function handleDeleteInstitutionalEvent(data: InstitutionalEventResponse) {
    setSelectedEvent(data);
    onOpenDelete();
  }

  return (
    <PageContent horizontalScroll>
      <InstitutionalEventModal
        isOpen={isOpenEventForm}
        onClose={onCloseEventForm}
        refetch={getEvents}
        selectedEvent={selectedEvent}
        buildings={buildings}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={() => {
          if (selectedEvent) {
            deleteEvent(selectedEvent.id);
            onCloseDelete();
          }
        }}
        title='Remover evento'
        warningText={`Tem certeza que deseja remover o evento "${selectedEvent?.title}"?`}
      />
      <Box w="100%" minW="344px">
      <Flex h='100%' direction={'column'}>
        {loading && (
          <Spinner
            alignSelf='center'
            position='fixed'
            size='xl'
            thickness='3px'
            speed='0.7s'
            emptyColor='gray.200'
            color='uspolis.blue'
          />
        )}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          gap={3}
          mb={4}
        >
          <Text fontSize={{ base: '24px', md: '4xl' }} mb={{ base: 0, md: 4 }}>
            Eventos
          </Text>
          <Spacer />
          <HStack display={{ base: 'none', md: 'flex' }}>
            <IconButton
              colorScheme='blue'
              icon={<GoSync />}
              aria-label='Get events'
              onClick={getEvents}
            />
            <Button colorScheme='blue' onClick={onOpenEventForm}>
              Cadastrar evento
            </Button>
          </HStack>
        </Flex>

        <Box display={{ base: 'none', md: 'block' }} w="100%">
          <DataTable loading={loading} data={events} columns={columns} />
        </Box>
        <Box display={{ base: 'block', md: 'none' }} w="100%">
          <InstitutionalEventCardList
            events={events}
            loading={loading}
            onEdit={handleEditInstitutionalEvent}
            onDelete={handleDeleteInstitutionalEvent}
            toolbarAction={
              <Button
                colorScheme="blue"
                onClick={onOpenEventForm}
                w="full"
              >
                Cadastrar evento
              </Button>
            }
          />
        </Box>
      </Flex>
      </Box>
    </PageContent>
  );
}

export default InstitutionalEvents;
