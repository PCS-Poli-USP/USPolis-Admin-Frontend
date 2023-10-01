import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/dataTable.component';
import Dialog from 'components/common/dialog.component';
import Navbar from 'components/common/navbar.component';
import CreateEventModal from 'components/events/CreateEventModal';
import { InstitutionalEvent } from 'models/institutionalEvent.model';
import moment from 'moment';
import { FaEllipsisV } from 'react-icons/fa';

const data: InstitutionalEvent[] = [
  {
    building: null,
    category: 'Processo Seletivo de Entidade',
    classroom: null,
    created_at: '2023-09-23T11:03:27.934981',
    description: 'PS 2024.1',
    end_timestamp: '2024-03-30T23:59:00.000',
    start_timestamp: '2024-03-01T10:00:00.000',
    external_link: 'www.polijunior.com.br',
    location: 'Sede - Poli Júnior',
    title: 'Processo seletivo Poli Júnior',
  },
  {
    building: null,
    category: 'Processo Seletivo de Entidade',
    classroom: null,
    created_at: '2023-09-23T11:05:16.591610',
    description: 'PS 2024.1',
    end_timestamp: '2024-03-30T23:59:00.000',
    external_link: 'www.polijunior.com.br',
    location: 'Sede - Poli Júnior',
    start_timestamp: '2024-03-01T10:00:00.000',
    title: 'Processo seletivo Poli Júnior',
  },
  {
    building: null,
    category: 'Processo Seletivo de Entidade',
    classroom: null,
    created_at: '2023-09-23T11:07:54.865158',
    description: 'PS 2024.1',
    end_datetime: '2024-03-30T23:59:00.000',
    external_link: 'www.polijunior.com.br',
    location: 'Sede - Poli Júnior',
    start_datetime: '2024-03-01T10:00:00.000',
    title: 'Processo seletivo Poli Júnior',
  },
  {
    building: null,
    category: 'Processo Seletivo de Entidade',
    classroom: null,
    created_at: '2023-09-23T11:33:43.308403',
    description: 'PS 2024.1',
    end_datetime: '2024-03-30T23:59:00.000',
    external_link: 'www.polijunior.com.br',
    location: 'Sede - Poli Júnior',
    start_datetime: '2024-03-01T10:00:00.000',
    title: 'Processo seletivo Poli Júnior',
  },
  {
    building: null,
    category: 'Processo Seletivo de Entidade',
    classroom: null,
    created_at: '2023-09-23T11:41:27.456542',
    description: 'PS 2024.1',
    end_datetime: '2024-03-30T23:59:00.000',
    external_link: 'www.polijunior.com.br',
    location: 'Sede - Poli Júnior',
    start_datetime: '2024-03-01T10:00:00.000',
    title: 'Processo seletivo Poli Júnior',
  },
];

function Events() {
  const { isOpen: isOpenCreate, onClose: onCloseCreate, onOpen: onOpenCreate } = useDisclosure();
  const { isOpen: isOpenEventForm, onClose: onCloseEventForm } = useDisclosure();

  const columns: ColumnDef<InstitutionalEvent>[] = [
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ row }) => moment(row.original.created_at).format('DD/MM/YYYY HH:mm'),
    },
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
    },
    {
      header: 'Local',
      cell: ({ row }) =>
        row.original.building ? `${row.original.building} - ${row.original.classroom}` : row.original.location,
    },
    {
      header: 'Período',
      cell: ({ row }) =>
        `${moment(row.original.start_datetime).format('DD/MM/YYYY HH:mm')} ~ ${moment(row.original.end_datetime).format(
          'DD/MM/YYYY HH:mm',
        )}`,
    },
    {
      id: 'options',
      cell: ({ row }) => (
        <Menu>
          <MenuButton as={IconButton} aria-label='Options' icon={<Icon as={FaEllipsisV} />} variant='ghost' />
          <MenuList>
            <MenuItem onClick={() => {}}>Ver detalhes</MenuItem>
            <MenuItem onClick={() => {}}>Editar</MenuItem>
            <MenuItem onClick={() => {}}>Deletar</MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <CreateEventModal isOpen={isOpenCreate} onClose={onCloseCreate} children={<></>} />
      <Dialog isOpen={isOpenEventForm} onClose={onCloseEventForm} onConfirm={() => {}} title={` `} />
      <Center>
        <Box p={4} w='80%' overflow='auto'>
          <Flex align='center' justify='space-between'>
            <Text fontSize='4xl' mb={4}>
              Eventos
            </Text>
            <Button ml={2} colorScheme='blue' onClick={onOpenCreate}>
              Cadastrar evento
            </Button>
          </Flex>

          <DataTable data={data} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Events;
