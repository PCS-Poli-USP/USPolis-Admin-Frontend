import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  HStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import {
  BsCalendarDateFill,
  BsClipboardCheck,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import HasToBeAllocatedDrawer from 'components/allocation/hasToBeAllocated.drawer';
import AutomaticAllocationModal from 'components/classes/automaticAllocation.modal';
import EditModal from 'components/classes/edit.modal';
import JupiterCrawlerPopover from 'components/classes/jupiterCrawler.popover';
import PreferencesModal from 'components/classes/preferences.modal';
import RegisterModal from 'components/classes/register.modal';
import EditEventModal from 'components/allocation/editEvent.modal';
import DataTable from 'components/common/dataTable.component';
import Dialog from 'components/common/dialog.component';
import Loading from 'components/common/loading.component';
import Navbar from 'components/common/navbar.component';
import { appContext } from 'context/AppContext';
import Class, {
  CreateClassEvents,
  HasToBeAllocatedClass,
  Preferences,
} from 'models/class.model';
import { ErrorResponse } from 'models/interfaces/serverResponses';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassesService from 'services/classes.service';
import BuildingsService from 'services/buildings.service';
import EventsService from 'services/events.service';
import { Capitalize } from 'utils/formatters';
import {
  FilterArray,
  FilterClassroom,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';
import {
  ClassToEventByClassroom,
  breakClassFormInEvents,
} from 'utils/classes/classes.formatter';
import { Building } from 'models/building.model';
import { EventByClassrooms } from 'models/event.model';

function Classes() {
  const [classesList, setClassesList] = useState<Array<Class>>([]);
  const [buildingsList, setBuildingsList] = useState<Array<Building>>([]);
  const [selectedClassEventList, setSelectedClassEventList] = useState<
    Array<EventByClassrooms>
  >([]);
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenPreferences,
    onOpen: onOpenPreferences,
    onClose: onClosePreferences,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenAlloc,
    onOpen: onOpenAlloc,
    onClose: onCloseAlloc,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocEdit,
    onOpen: onOpenAllocEdit,
    onClose: onCloseAllocEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenRegister,
    onOpen: onOpenRegister,
    onClose: onCloseRegister,
  } = useDisclosure();
  const {
    isOpen: isOpenTest,
    onOpen: onOpenTest,
    onClose: onCloseTest,
  } = useDisclosure();

  const [selectedClass, setSelectedClass] = useState<Class>();
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);
  const [allocatedEvents, setAllocatedEvents] = useState<Class[]>([]);
  const [unallocatedEvents, setUnallocatedEvents] = useState<Class[]>([]);

  const navigate = useNavigate();

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

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'subject_code',
      header: 'Código',
    },
    {
      accessorKey: 'class_code',
      header: 'Turma',
    },
    {
      accessorKey: 'subject_name',
      header: 'Disciplina',
    },
    {
      accessorFn: (row) => (row.classrooms ? row.classrooms : ['Não alocada']),
      filterFn: FilterClassroom,
      header: 'Sala',
      cell: ({ row }) => (
        <Box>
          <Text>
            {row.original.classrooms && row.original.classrooms.length > 0
              ? row.original.classrooms[0]
              : 'Não alocada'}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'subscribers',
      header: 'Nº Alunos',
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'professors',
      header: 'Professores',
      cell: ({ row }) => (
        <Box>
          {row.original.professors?.map((professor, index) => (
            <Text key={index}>{professor}</Text>
          ))}
        </Box>
      ),
      filterFn: FilterArray,
    },
    {
      accessorFn: (row) =>
        row.week_days?.map(
          (day, index) =>
            `${Capitalize(day)} ${row.start_time[index]} - ${
              row.end_time[index]
            }`,
        ),
      header: 'Horários',
      cell: (info) => (
        <Box>
          {(info.getValue() as string[])?.map((it) => (
            <Text key={it}>{it}</Text>
          ))}
        </Box>
      ),
      filterFn: FilterArray,
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Editar Turma'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-turma'
              icon={<BsFillPenFill />}
              onClick={() => handleEditClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Editar Alocação'>
            <IconButton
              colorScheme='teal'
              size='xs'
              variant='ghost'
              aria-label='editar-alocacao'
              icon={<BsCalendarDateFill />}
              onClick={() => handleAllocationEditClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Preferências'>
            <IconButton
              size='xs'
              variant='ghost'
              aria-label='preferências-turma'
              icon={<BsClipboardCheck />}
              onClick={() => handlePreferencesClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Deletar'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='deletar-turma'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];

  const classesService = new ClassesService();
  const buildingsService = new BuildingsService();
  const eventsService = new EventsService();

  useEffect(() => {
    fetchData();
    fetchBuildings();
    // eslint-disable-next-line
  }, []);

  function sortBuilding(a: Building, b: Building) {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }

  function fetchBuildings() {
    buildingsService.list().then((it) => {
      setBuildingsList(it.data.sort(sortBuilding));
    });
  }

  function fetchData() {
    setLoading(true);
    classesService
      .list()
      .then((it) => {
        setClassesList(it.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toastError(`Erro ao carregar turmas: ${error.message}`);
      });
  }

  function handleRegisterClick() {
    onOpenRegister();
  }

  function handleRegister(data: Class) {
    const events: CreateClassEvents[] = breakClassFormInEvents(data);
    classesService
      .createOne(events)
      .then(() => {
        fetchData();
        toastSuccess('Turma criada com sucesso!');
      })
      .catch((error) => {
        toastError(`Erro ao criar turma: ${error}`);
      });
  }

  function handleDeleteClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDelete();
  }

  function handleDelete() {
    if (selectedClass) {
      classesService
        .delete(selectedClass.subject_code, selectedClass.class_code)
        .then((it) => {
          onCloseDelete();
          fetchData();
          toastSuccess('Turma deletada com sucesso!');
        })
        .catch((error) => {
          toastError(`Erro ao deletar turma: ${error}`);
        });
    }
  }

  function handleAllocationEditClick(obj: Class) {
    setSelectedClass(obj);
    const events = ClassToEventByClassroom(obj, buildingsList);
    setSelectedClassEventList(events);
    onOpenAllocEdit();
  }

  function handleAllocationEdit(
    subjectCode: string,
    classCode: string,
    weekDays: string[],
    newClassroom: string,
    building: string,
  ) {
    eventsService
      .edit(subjectCode, classCode, weekDays, newClassroom, building)
      .then((it) => {
        toastSuccess('Alocação editada com sucesso!');
        fetchData();
        // refetch data
        // TODO: create AllocationContext
      })
      .catch((error) => {
        toastError(`Erro ao editar alocação: ${error}`);
      });
  }

  function handlePreferencesClick(obj: Class) {
    setSelectedClass(obj);
    onOpenPreferences();
  }

  function handleSavePreferences(data: Preferences) {
    if (selectedClass) {
      classesService
        .patchPreferences(
          selectedClass.subject_code,
          selectedClass.class_code,
          data,
        )
        .then((it) => {
          fetchData();
          toastSuccess('Preferências editadas com sucesso!');
        })
        .catch((error) => {
          toastError(`Erro ao editar preferências: ${error}`);
        });
    }
  }

  function handleAllocClick() {
    onOpenAlloc();
  }

  function handleAlloc() {
    setAllocating(true);
    eventsService
      .allocate()
      .then((it) => {
        console.log(it.data.allocated);
        console.log(it.data.unallocated)
        setAllocatedEvents(it.data.allocated);
        setUnallocatedEvents(it.data.unallocated);
        onCloseAlloc();
        onOpenTest();
      })
      .catch(({ response }: AxiosError<ErrorResponse>) => {
        onCloseAlloc();
        onOpenDrawer();
        console.log(response?.data.error);
      })
      .finally(() => setAllocating(false));
  }

  function handleEditClick(obj: Class) {
    setSelectedClass(obj);
    onOpenEdit();
  }

  function handleEdit(data: Class) {
    if (selectedClass) {
      const events = breakClassFormInEvents(data);
      classesService
        .edit(selectedClass.subject_code, selectedClass.class_code, events)
        .then((it) => {
          fetchData();
          toastSuccess('Turma editada com sucesso!');
        })
        .catch((error) => {
          toastError(`Erro ao criar turma: ${error}`);
        });
    }
  }

  function handleDrawerAlloc(data: HasToBeAllocatedClass[]) {
    setAllocating(true);
    classesService.editHasToBeAllocated(data).then(() => handleAlloc());
  }

  function handleCrawlerSave(subjectsList: string[]) {
    classesService
      .createMany(subjectsList)
      .then((it) => {
        console.log(it);
        fetchData();
      })
      .catch(({ response }: AxiosError<ErrorResponse>) =>
        toastError(`Erro ao buscar disciplinas: ${response?.data.message}`),
      );
  }

  function handleTest() {
    onOpenTest();
  }

  function handleSave() {}

  return (
    <>
      <Navbar />
      <Loading isOpen={allocating} onClose={() => setAllocating(false)} />
      <PreferencesModal
        isOpen={isOpenPreferences}
        onClose={onClosePreferences}
        data={selectedClass}
        buildings={buildingsList}
        onSave={handleSavePreferences}
      />
      <RegisterModal
        isOpen={isOpenRegister}
        onClose={onCloseRegister}
        onSave={handleRegister}
        buildings={buildingsList}
      />
      <EditModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        formData={selectedClass}
        onSave={handleEdit}
      />
      <EditEventModal
        isOpen={isOpenAllocEdit}
        onClose={onCloseAllocEdit}
        onSave={handleAllocationEdit}
        classEvents={selectedClassEventList}
      />
      <HasToBeAllocatedDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        classesList={classesList}
        onSave={handleDrawerAlloc}
      />
      <Dialog
        isOpen={isOpenAlloc}
        onClose={onCloseAlloc}
        onConfirm={handleAlloc}
        title='Deseja calcular alocação para as turmas e salas cadastradas'
        warningText='ATENÇÃO: AO CONFIRMAR QUALQUER ALOCAÇÃO SALVA SERÁ PERDIDA'
      />
      <AutomaticAllocationModal
        isOpen={isOpenTest}
        onClose={onCloseTest}
        onSave={handleSave}
        allocatedEvents={allocatedEvents}
        unallocatedEvents={unallocatedEvents}
      />

      <Center>
        <Box p={4} w='9xl' overflow='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Turmas
            </Text>
            <Spacer />
            <Button mr={2} colorScheme='blue' onClick={handleRegisterClick}>
              Adicionar Turma
            </Button>
            <JupiterCrawlerPopover onSave={handleCrawlerSave} />
            <Button ml={2} colorScheme='red' onClick={handleAllocClick}>
              Alocação Automática
            </Button>
          </Flex>
          <Dialog
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            onConfirm={handleDelete}
            title={`Deseja deletar ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
          />
          <DataTable data={classesList} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Classes;
