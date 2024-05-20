import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Navbar from 'components/common/NavBar/navbar.component';
import EventFormModal from 'components/events/EventFormModal';
import { InstitutionalEvent } from 'models/common/institutionalEvent.model';
import moment from 'moment';
import { FaEllipsisV } from 'react-icons/fa';
import { GoSync } from 'react-icons/go';
import { useEvents } from './hook';
import { useEffect, useState } from 'react';
import { Building } from 'models/common/building.model';
import BuildingsService from 'services/api/buildings.service';
import { sortBuildings } from 'utils/sorter';
import { periodFormatter } from './formatters';

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

  const [selectedEvent, setSelectedEvent] = useState<InstitutionalEvent | null>(
    null,
  );
  const [buildings, setBuildings] = useState<Array<Building>>([]);

  const { events, loading, getEvents, deleteEvent } = useEvents();
  const buildingsService = new BuildingsService();

  const columns: ColumnDef<InstitutionalEvent>[] = [
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ row }) =>
        moment(row.original.created_at).format('DD/MM/YYYY HH:mm'),
    },
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => (
        <Box maxWidth='450px'>
          <Text textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
            {row.original.description}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
    },
    {
      header: 'Local',
      cell: ({ row }) =>
        row.original.building
          ? `${row.original.building} - ${row.original.classroom}`
          : row.original.location,
    },
    {
      header: 'Período',
      cell: ({ row }) => periodFormatter(row),
    },
    {
      id: 'options',
      cell: ({ row }) => (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<Icon as={FaEllipsisV} />}
            variant='ghost'
          />
          <MenuList>
            <MenuItem
              onClick={() => {
                setSelectedEvent(row.original);
                onOpenEventForm();
              }}
            >
              Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedEvent(row.original);
                onOpenDelete();
              }}
            >
              Deletar
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (!isOpenEventForm) setSelectedEvent(null);
  }, [isOpenEventForm]);

  useEffect(() => {
    if (!isOpenDelete) setSelectedEvent(null);
  }, [isOpenDelete]);

  function fetchBuildings() {
    buildingsService.list().then((it) => {
      setBuildings(it.data.sort(sortBuildings));
    });
  }

  return (
    <>
      <Navbar />
      <EventFormModal
        isOpen={isOpenEventForm}
        onClose={onCloseEventForm}
        children={null}
        refetch={getEvents}
        selectedEvent={selectedEvent}
        buildings={buildings}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={() => {
          if (!!selectedEvent) {
            deleteEvent(selectedEvent._id);
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
