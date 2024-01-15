import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import { BsClipboardCheck, BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import RegisterModal from 'components/classrooms/register.modal';
import DataTable from 'components/common/dataTable.component';
import Dialog from 'components/common/dialog.component';
import Navbar from 'components/common/navbar.component';
import { appContext } from 'context/AppContext';
import Classroom from 'models/classroom.model';
import { useContext, useEffect, useState } from 'react';
import ClassroomsService from 'services/classrooms.service';
import { FilterBoolean, FilterNumber } from 'utils/tanstackTableHelpers/tableFiltersFns';

function Classrooms() {
  const [classroomsList, setClassroomsList] = useState<Array<Classroom>>([]);
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom>();
  const [isUpdate, setIsUpdate] = useState(false);
  const { setLoading } = useContext(appContext);

  const columns: ColumnDef<Classroom>[] = [
    {
      accessorKey: 'classroom_name',
      header: 'Nome',
    },
    {
      accessorKey: 'building',
      header: 'Prédio',
      meta: { isSelectable: true },
    },
    {
      accessorKey: 'floor',
      header: 'Andar',
      meta: { isSelectable: true },
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'capacity',
      header: 'Capacidade',
      meta: { isSelectable: true },
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'air_conditioning',
      header: 'Ar condicionado',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'projector',
      header: 'Projetor',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'accessibility',
      header: 'Acessibilidade',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Editar'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-sala'
              icon={<BsFillPenFill />}
              onClick={() => handleEditClick(row.original)}
            />
          </Tooltip>
      
          <Tooltip label='Deletar'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='deletar-sala'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];

  const classroomService = new ClassroomsService();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  function fetchData() {
    setLoading(true);
    classroomService.list().then((it) => {
      setClassroomsList(it.data);
      setLoading(false);
    });
  }

  function handleDeleteClick(data: Classroom) {
    setSelectedClassroom(data);
    onOpenDelete();
  }

  function handleEditClick(data: Classroom) {
    setSelectedClassroom(data);
    setIsUpdate(true);
    onOpenRegister();
  }

  function handleCreateClick() {
    setIsUpdate(false);
    onOpenRegister();
  }

  function handleDelete() {
    if (selectedClassroom) {
      classroomService.delete(selectedClassroom.classroom_name).then((it) => {
        console.log(it.data);
        onCloseDelete();
        fetchData();
      });
    }
  }

  function handleSave(formData: Classroom) {
    const request = isUpdate
      ? classroomService.update(formData.classroom_name, formData)
      : classroomService.create(formData);
    Promise.resolve(request).then((it) => {
      console.log(it.data);
      fetchData();
    });
  }

  return (
    <>
      <Navbar />
      <RegisterModal
        isOpen={isOpenRegister}
        onClose={onCloseRegister}
        formData={selectedClassroom}
        isUpdate={isUpdate}
        onSave={handleSave}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja deletar ${selectedClassroom?.classroom_name}`}
      />
      <Center>
        <Box p={4} w='7xl' overflowX='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Salas de aula
            </Text>
            <Spacer />
            <Button colorScheme='blue' onClick={handleCreateClick}>
              Cadastrar
            </Button>
          </Flex>
          <DataTable data={classroomsList} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Classrooms;
