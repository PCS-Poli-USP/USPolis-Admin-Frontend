import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { GoSync } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { getInstitutionalEventsColumns } from './Tables/institutionalEvent.table';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import useInstitutionalEvents from 'hooks/useInstitutionalEvents';
import InstitutionalEventModal from './InstitutionalEventModal/institutionalEvent.modal';
import useBuildings from 'hooks/useBuildings';

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
    <>
      <Navbar />
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
          if (!!selectedEvent) {
            deleteEvent(selectedEvent.id);
            onCloseDelete();
          }
        }}
        title='Remover evento'
        warningText={`Tem certeza que deseja remover o evento "${selectedEvent?.title}"?`}
      />
      <Center h='100%'>
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
        <Box p={10} w='100%' overflow='auto'>
          <Flex align='center' justify='space-between'>
            <Text fontSize='4xl' mb={4}>
              Eventos
            </Text>
            <HStack gap={1}>
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

          <DataTable data={events} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default InstitutionalEvents;
