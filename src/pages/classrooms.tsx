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
  useToast,
} from '@chakra-ui/react';

import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import RegisterModal from 'components/classrooms/register.modal';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { appContext } from 'context/AppContext';
import Classroom from 'models/common/classroom.model';
import { useContext, useEffect, useState } from 'react';
import ClassroomsService from 'services/api/classrooms.service';
import {
  FilterBoolean,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

import { sortClassrooms } from 'utils/sorter';
import BuildingsService from 'services/api/buildings.service';
import AdminClassroomService from 'services/api/admin.classrooms.service';
import { sortBuildingsResponse } from 'utils/buildings/building.sorter';
import { BuildingResponse } from 'models/http/responses/building.response.models';

function Classrooms() {
  const [classroomsList, setClassroomsList] = useState<Array<Classroom>>([]);
  const [buildingsList, setBuildingsList] = useState<Array<BuildingResponse>>(
    [],
  );
  const {
    isOpen: isOpenRegister,
    onOpen: onOpenRegister,
    onClose: onCloseRegister,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom>();
  const [isUpdate, setIsUpdate] = useState(false);
  const { setLoading, loggedUser } = useContext(appContext);

  const [columns, setColumns] = useState<ColumnDef<Classroom>[]>([
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
      accessorKey: 'ignore_to_allocate',
      header: 'Ignorar',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
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
  ]);

  const classroomService = new ClassroomsService();
  const adminClassroomService = new AdminClassroomService();
  const buildingsService = new BuildingsService();

  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    fetchData();
    fetchBuildings();
    if (loggedUser?.is_admin)
      setColumns([
        {
          accessorKey: 'created_by',
          header: 'Usuário',
        },
        ...columns,
      ]);
    // eslint-disable-next-line
  }, [loggedUser?.is_admin]);

  function fetchData() {
    setLoading(true);
    if (!!loggedUser) {
      if (!loggedUser.is_admin) {
        classroomService.list().then((it) => {
          setClassroomsList(it.data.sort(sortClassrooms));
          setLoading(false);
        });
      } else {
        adminClassroomService.list().then((it) => {
          setClassroomsList(it.data.sort(sortClassrooms));
          setLoading(false);
        });
      }
    }
  }

  function fetchBuildings() {
    buildingsService.list().then((it) => {
      setBuildingsList(it.data.sort(sortBuildingsResponse));
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
      classroomService
        .delete(selectedClassroom.classroom_name)
        .then((it) => {
          console.log(it.data);
          toastSuccess('Sala deletada com sucesso!');
          onCloseDelete();
          fetchData();
        })
        .catch((error) => {
          toastError(`Erro ao remover sala: ${error}`);
        });
    }
  }

  function handleSave(formData: Classroom) {
    const { id, ...formDataWithoutId } = formData;
    const request = isUpdate
      ? loggedUser?.is_admin
        ? adminClassroomService.update(id, formDataWithoutId)
        : classroomService.update(
            formDataWithoutId.classroom_name,
            formDataWithoutId,
          )
      : classroomService.create(formDataWithoutId);
    Promise.resolve(request)
      .then((it) => {
        console.log(it.data);
        if (isUpdate) toastSuccess('Sala editada com sucesso!');
        else toastSuccess('Sala criada com sucesso!');
        fetchData();
      })
      .catch((error) => {
        console.log(error);
        if (isUpdate) toastError(`Erro ao editar turma: ${error}`);
        else toastError(`Erro ao criar sala: ${error}`);
      });
  }

  return (
    <>
      <Navbar />
      <RegisterModal
        isOpen={isOpenRegister}
        onClose={onCloseRegister}
        formData={selectedClassroom}
        buildingsOptions={buildingsList}
        isUpdate={isUpdate}
        onSave={handleSave}
      />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja deletar ${selectedClassroom?.classroom_name}?`}
      />
      <Center>
        <Box p={4} w='8xl' overflowX='auto'>
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
