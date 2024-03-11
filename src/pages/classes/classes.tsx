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
  BsCalendarXFill,
} from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
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
import Class, { CreateClassEvents, Preferences } from 'models/class.model';
import { ErrorResponse } from 'models/interfaces/serverResponses';
import { useContext, useEffect, useState } from 'react';
import ClassesService from 'services/classes.service';
import BuildingsService from 'services/buildings.service';
import EventsService from 'services/events.service';
import { Capitalize } from 'utils/formatters';
import {
  FilterArray,
  FilterBoolean,
  FilterClassroom,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';
import {
  ClassToEventByClassroom,
  breakClassFormInEvents,
} from 'utils/classes/classes.formatter';
import { Building } from 'models/building.model';
import { EventByClassrooms } from 'models/event.model';
import CrawlerService from 'services/crawler.service';
import { sortBuildings, sortClasses } from 'utils/sorter';
import JupiterCrawlerModal from 'components/classes/jupiterCrawler.modal';
import { SClassesBySubject } from 'utils/mappers/classes.mapper';
import MultipleEditModal from 'components/classes/multipleEdit.modal';

function Classes() {
  const [classesList, setClassesList] = useState<Array<Class>>([]);
  const [buildingsList, setBuildingsList] = useState<Array<Building>>([]);
  const [selectedClassEventList, setSelectedClassEventList] = useState<
    Array<EventByClassrooms>
  >([]);
  const {
    isOpen: isOpenDeleteClass,
    onOpen: onOpenDeleteClass,
    onClose: onCloseDeleteClass,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteAllClasses,
    onOpen: onOpenDeleteAllClasses,
    onClose: onCloseDeleteAllClasses,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteAlloc,
    onOpen: onOpenDeleteAlloc,
    onClose: onCloseDeleteAlloc,
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
    isOpen: isOpenJupiterModal,
    onOpen: onOpenJupiterModal,
    onClose: onCloseJupiterModal,
  } = useDisclosure();
  const {
    isOpen: isOpenMultipleEdit,
    onOpen: onOpenMultipleEdit,
    onClose: onCloseMultipleEdit,
  } = useDisclosure();

  const [selectedClass, setSelectedClass] = useState<Class>();
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);

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
      accessorKey: 'ignore_to_allocate',
      header: 'Ignorar',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorFn: (row) => (row.classrooms ? row.classrooms : ['Não alocada']),
      filterFn: FilterClassroom,
      header: 'Sala',
      cell: ({ row }) => (
        <Box>
          {row.original.classrooms ? (
            row.original.classrooms.map((classroom, index) => (
              <Text key={index}>{classroom}</Text>
            ))
          ) : (
            <Text>Não alocada</Text>
          )}
        </Box>
      ),
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
            <Text
              maxW={425}
              overflowX={'hidden'}
              textOverflow={'ellipsis'}
              key={index}
            >
              {professor}
            </Text>
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
          <Tooltip label='Excluir Turma'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='excluir-turma'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteClassClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Excluir Alocação'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='excluir-alocacao'
              icon={<BsCalendarXFill />}
              onClick={() => handleDeleteAllocClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];

  const classesService = new ClassesService();
  const buildingsService = new BuildingsService();
  const crawlerService = new CrawlerService();
  const eventsService = new EventsService();

  useEffect(() => {
    fetchData();
    fetchBuildings();
    // eslint-disable-next-line
  }, []);

  function fetchBuildings() {
    buildingsService.list().then((it) => {
      setBuildingsList(it.data.sort(sortBuildings));
    });
  }

  function fetchData() {
    setLoading(true);
    classesService
      .list()
      .then((it) => {
        setClassesList(it.data.sort(sortClasses));
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

  function handleDeleteClassClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDeleteClass();
  }

  function handleDeleteAllocClick(obj: Class) {
    setSelectedClass(obj);
    onOpenDeleteAlloc();
  }

  function handleDeleteClass() {
    if (selectedClass) {
      classesService
        .delete(selectedClass.subject_code, selectedClass.class_code)
        .then((it) => {
          onCloseDeleteClass();
          fetchData();
          toastSuccess('Turma deletada com sucesso!');
        })
        .catch((error) => {
          toastError(`Erro ao deletar turma: ${error}`);
        });
    }
  }

  function handleDeleteAlloc() {
    if (selectedClass) {
      eventsService
        .deleteClassAllocation(
          selectedClass.subject_code,
          selectedClass.class_code,
        )
        .then((it) => {
          onCloseDeleteAlloc();
          fetchData();
          toastSuccess(
            `Alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}  deletada com sucesso!`,
          );
        })
        .catch((error) => {
          toastError(
            `Erro ao deletar alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}: ${error}`,
          );
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
    events_ids: string[],
    newClassroom: string,
    building_id: string,
  ) {
    eventsService
      .editManyAllocations({
        events_ids,
        classroom: newClassroom,
        building_id,
      })
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

  function handleAllocationEditDelete(subjectCode: string, classCode: string) {
    eventsService
      .deleteClassAllocation(subjectCode, classCode)
      .then((it) => {
        toastSuccess(
          `Alocação de ${subjectCode} - ${classCode}  deletada com sucesso!`,
        );
        fetchData();
      })
      .catch((error) => {
        toastError(
          `Erro ao deletar alocação de ${subjectCode} - ${classCode}: ${error}`,
        );
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

  function handleCrawlerSave(subjectsList: string[], building_id: string) {
    setLoading(true);
    crawlerService
      .crawl({
        building_id,
        subject_codes_list: subjectsList,
      })
      .then((it) => {
        setSuccessSubjects(it.data.sucess);
        setFailedSubjects(it.data.failed);
        onOpenJupiterModal();
        fetchData();
        toastSuccess('Disciplinas foram carregadas com sucesso!');
      })
      .catch(({ response }: AxiosError<ErrorResponse>) =>
        toastError(`Erro ao buscar disciplinas: ${response?.data.message}`),
      )
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDeleteAllClassesClick() {
    onOpenDeleteAllClasses();
  }

  function handleDeleteAllClasses() {
    eventsService
      .deleteAllEvents()
      .then((it) => {
        toastSuccess(`Foram removidos ${it.data} eventos`);
        fetchData();
      })
      .catch((error) => {
        toastError(`Erro ao remover turmas: ${error.message}`);
      });
    onCloseDeleteAllClasses();
  }

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
        buildings={buildingsList}
      />
      <EditEventModal
        isOpen={isOpenAllocEdit}
        onClose={onCloseAllocEdit}
        onSave={handleAllocationEdit}
        onDelete={handleAllocationEditDelete}
        classEvents={selectedClassEventList}
      />
      <JupiterCrawlerModal
        isOpen={isOpenJupiterModal}
        onClose={onCloseJupiterModal}
        successSubjects={successSubjects}
        failedSubjects={failedSubjects}
      />
      <MultipleEditModal
        isOpen={isOpenMultipleEdit}
        onClose={onCloseMultipleEdit}
        subjectsMap={SClassesBySubject(classesList)}
        onRefresh={() => fetchData()}
      />

      <Center>
        <Box p={4} w={'95%'} overflow='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Turmas
            </Text>
            <Spacer />
            <Button mr={2} colorScheme={'blue'} onClick={handleRegisterClick}>
              Adicionar Turma
            </Button>
            <JupiterCrawlerPopover onSave={handleCrawlerSave} />
            <Button
              ml={2}
              colorScheme={'blue'}
              onClick={() => {
                onOpenMultipleEdit();
              }}
            >
              Editar vários
            </Button>
            <Button
              ml={2}
              colorScheme={'red'}
              onClick={handleDeleteAllClassesClick}
            >
              Remover todas turmas
            </Button>
          </Flex>
          <Dialog
            isOpen={isOpenDeleteClass}
            onClose={onCloseDeleteClass}
            onConfirm={handleDeleteClass}
            title={`Deseja remover ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
          />
          <Dialog
            isOpen={isOpenDeleteAllClasses}
            onClose={onCloseDeleteAllClasses}
            onConfirm={handleDeleteAllClasses}
            title={`Deseja remover todas as turmas`}
            warningText='ATENÇÃO: QUALQUER TURMA SALVA SERÁ PERDIDA!'
          />
          <Dialog
            isOpen={isOpenDeleteAlloc}
            onClose={onCloseDeleteAlloc}
            onConfirm={handleDeleteAlloc}
            title={`Deseja remover a alocação de ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
            warningText='Atenção: ao confirmar a alocação dessa turma será perdida'
          />
          <DataTable data={classesList} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Classes;
