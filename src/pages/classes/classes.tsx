import {
  Box,
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import JupiterCrawlerPopover from 'components/classes/jupiterCrawler.popover';
import EditEventModal from 'components/allocation/editEvent.modal';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Loading from 'components/common/Loading/loading.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { appContext } from 'context/AppContext';
import Class from 'models/common/class.model';
import { useContext, useState } from 'react';
import EventsService from 'services/api/events.service';
import {
  ClassToEventByClassroom,
  breakClassFormInEvents,
} from 'utils/classes/classes.formatter';
import { EventByClassrooms } from 'models/common/event.model';
import CrawlerService from 'services/api/crawler.service';
import JupiterCrawlerModal from 'components/classes/jupiterCrawler.modal';
import MultipleEditModal from 'components/classes/multipleEdit.modal';
import { getClassesColumns } from './Tables/class.table';
import { ClassResponse } from 'models/http/responses/class.response.models';
import useClasses from 'hooks/useClasses';
import ClassModal from './ClassModal/class.modal';
import useSubjects from 'hooks/useSubjetcts';
import useCalendars from 'hooks/useCalendars';
import { Row } from '@tanstack/react-table';

function Classes() {
  const {
    isOpen: isOpenDeleteClass,
    onOpen: onOpenDeleteClass,
    onClose: onCloseDeleteClass,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteSelectedClasses,
    onOpen: onOpenDeleteSelectedClasses,
    onClose: onCloseDeleteSelectedClasses,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteAlloc,
    onOpen: onOpenDeleteAlloc,
    onClose: onCloseDeleteAlloc,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocEdit,
    onOpen: onOpenAllocEdit,
    onClose: onCloseAllocEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenClassModal,
    onOpen: onOpenClassModal,
    onClose: onCloseClassModal,
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

  const [selectedClass, setSelectedClass] = useState<ClassResponse>();
  const [isUpdateClass, setIsUpdateClass] = useState(false);
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);

  const { subjects } = useSubjects();
  const { calendars } = useCalendars();
  const { classes, getClasses, deleteClass } = useClasses();

  const [checkMap, setCheckMap] = useState<boolean[]>(classes.map(() => false));

  const columns = getClassesColumns({
    handleCheckAllClick,
    handleCheckboxClick,
    handleEditClick,
    handleAllocationEditClick,
    handlePreferencesClick,
    handleDeleteClassClick,
    handleDeleteAllocClick,
    checkMap,
  });

  // function fetchData() {
  //   setLoading(true);
  //   classesService
  //     .list()
  //     .then((it) => {
  //       const classes = ClassToSClass(it.data.sort(sortClassResponse));
  //       setClassesList(classes);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       showToast('Erro!', `Erro ao carregar turmas: ${error.message}`, 'error');
  //     });
  // }

  function handleRegisterClick() {
    onOpenClassModal();
  }

  // function handleRegister(data: Class) {
  //   const events: CreateClassEvents[] = breakClassFormInEvents(data);
  //   classesService
  //     .create(events)
  //     .then(() => {
  //       fetchData();
  //       showToast('Sucesso!', 'Turma criada com sucesso!', 'success');
  //     })
  //     .catch((error) => {
  //       showToast('Erro!', `Erro ao criar turma: ${error}`, 'error');
  //     });
  // }

  function handleDeleteClassClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenDeleteClass();
  }

  function handleDeleteAllocClick(obj: ClassResponse) {
    // setSelectedClass(obj);
    // onOpenDeleteAlloc();
  }

  async function handleDeleteClass() {
    if (selectedClass) {
      await deleteClass(selectedClass.id);
      setSelectedClass(undefined);
      onCloseDeleteClass();
    }
  }

  // function handleDeleteAlloc() {
  //   if (selectedClass) {
  //     eventsService
  //       .deleteClassAllocation(
  //         selectedClass.subject_code,
  //         selectedClass.class_code,
  //       )
  //       .then((it) => {
  //         onCloseDeleteAlloc();
  //         fetchData();
  //         showToast(
  //           'Sucesso!',
  //           `Alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}  deletada com sucesso!`,
  //           'success',
  //         );
  //       })
  //       .catch((error) => {
  //         showToast(
  //           'Erro!',
  //           `Erro ao deletar alocação de ${selectedClass.subject_code} - ${selectedClass.class_code}: ${error}`,
  //           'error',
  //         );
  //       });
  //   }
  // }

  function handleAllocationEditClick(obj: ClassResponse) {
    // setSelectedClass(obj);
    // const events = ClassToEventByClassroom(obj, buildingsList);
    // setSelectedClassEventList(events);
    // onOpenAllocEdit();
  }

  function handleAllocationEdit(
    events_ids: string[],
    newClassroom: string,
    building_id: number,
  ) {
    // eventsService
    //   .editManyAllocations({
    //     events_ids,
    //     classroom: newClassroom,
    //     building_id,
    //   })
    //   .then((it) => {
    //     showToast('Sucesso!', 'Alocação editada com sucesso!', 'success');
    //     fetchData();
    //     // refetch data
    //     // TODO: create AllocationContext
    //   })
    //   .catch((error) => {
    //     showToast('Erro!', `Erro ao editar alocação: ${error}`, 'error');
    //   });
  }

  function handleAllocationEditDelete(subjectCode: string, classCode: string) {
    // eventsService
    //   .deleteClassAllocation(subjectCode, classCode)
    //   .then((it) => {
    //     showToast(
    //       'Sucesso!',
    //       `Alocação de ${subjectCode} - ${classCode}  deletada com sucesso!`,
    //       'success',
    //     );
    //     fetchData();
    //   })
    //   .catch((error) => {
    //     showToast(
    //       'Erro!',
    //       `Erro ao deletar alocação de ${subjectCode} - ${classCode}: ${error}`,
    //       'error',
    //     );
    //   });
  }

  function handlePreferencesClick(obj: ClassResponse) {
    // setSelectedClass(obj);
    // onOpenPreferences();
  }

  // function handleSavePreferences(data: Preferences) {
  //   if (selectedClass) {
  //     classesService
  //       .patchPreferences(
  //         selectedClass.subject_code,
  //         selectedClass.class_code,
  //         data,
  //       )
  //       .then((it) => {
  //         fetchData();
  //         showToast('Sucesso!', 'Preferências editadas com sucesso!', 'success');
  //       })
  //       .catch((error) => {
  //         showToast('Erro!', `Erro ao editar preferências: ${error}`, 'error');
  //       });
  //   }
  // }

  function handleEditClick(data: ClassResponse) {
    setSelectedClass(data);
    setIsUpdateClass(true);
    onOpenClassModal();
  }

  function handleEdit(data: Class) {
    // if (selectedClass) {
    //   const events = breakClassFormInEvents(data);
    //   classesService
    //     .edit(selectedClass.subject_code, selectedClass.class_code, events)
    //     .then((it) => {
    //       fetchData();
    //       showToast('Sucesso!', 'Turma editada com sucesso!', 'success');
    //     })
    //     .catch((error) => {
    //       showToast('Erro!', `Erro ao criar turma: ${error}`, 'error');
    //     });
    // }
  }

  function handleCrawlerSave(subjectsList: string[], building_id: number) {
    // setLoading(true);
    // crawlerService
    //   .crawl({
    //     building_id,
    //     subject_codes_list: subjectsList,
    //   })
    //   .then((it) => {
    //     setSuccessSubjects(it.data.sucess);
    //     setFailedSubjects(it.data.failed);
    //     onOpenJupiterModal();
    //     fetchData();
    //     showToast(
    //       'Sucesso!',
    //       'Disciplinas foram carregadas com sucesso!',
    //       'success',
    //     );
    //   })
    //   .catch(({ response }: AxiosError<ErrorResponse>) =>
    //     showToast(
    //       'Erro!',
    //       `Erro ao buscar disciplinas: ${response?.data.message}`,
    //       'error',
    //     ),
    //   )
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }

  function handleDeleteSelectedClassesClick() {
    onOpenDeleteSelectedClasses();
  }

  function getSelectedEventsIds() {
    // const events_ids: string[] = [];
    // const checkedClasses = getCheckedClasses();
    // checkedClasses.forEach((cl) => events_ids.push(...cl.events_ids));
    // return events_ids;
  }

  function handleDeleteSelectedClasses() {
    // const events_ids = getSelectedEventsIds();
    // setLoading(true);
    // eventsService
    //   .deleteManyEvents({ events_ids })
    //   .then((it) => {
    //     showToast('Sucesso!', 'Turmas removidas com sucesso!', 'success');
    //   })
    //   .catch((error) => {
    //     showToast('Erro!', `Erro ao remover turmas: ${error}`, 'error');
    //   })
    //   .finally(() => {
    //     fetchData();
    //     setLoading(false);
    //   });
    // onCloseDeleteSelectedClasses();
  }

  function getCheckedClasses() {
    // const checkedClasses: SClass[] = [];
    // classesList.forEach((cl) => {
    //   if (cl.selected) checkedClasses.push(cl);
    // });
    // return checkedClasses;
  }

  function handleCheckAllClick(data: Row<ClassResponse>[], value: boolean) {
    const newCheckMap = [...checkMap];
    const filteredIds = data.map((cls) => Number(cls.original.id));
    console.log('Ids', filteredIds);
    filteredIds.forEach((id) => {
      const index = classes.findIndex((cls) => cls.id === id);
      console.log('Index atual: ', index);
      if (index >= 0) newCheckMap[index] = value;
    });
    setCheckMap(newCheckMap);
  }

  function handleCheckboxClick(id: number, value: boolean) {
    const index = classes.findIndex((cls) => cls.id === id);
    if (index < 0) return;
    const newCheckMap = [...checkMap];
    newCheckMap[index] = value;
    setCheckMap(newCheckMap);
  }

  return (
    <>
      <Navbar />
      <Loading isOpen={allocating} onClose={() => setAllocating(false)} />
      {/* <PreferencesModal
        isOpen={isOpenPreferences}
        onClose={onClosePreferences}
        data={selectedClass}
        buildings={buildingsList}
        onSave={handleSavePreferences}
      /> */}

      <ClassModal
        isOpen={isOpenClassModal}
        onClose={onCloseClassModal}
        isUpdate={isUpdateClass}
        refetch={getClasses}
        subjects={subjects}
        calendars={calendars}
        selectedClass={selectedClass}
      />

      {/* <EditEventModal
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
      /> */}
      {/* <MultipleEditModal
        isOpen={isOpenMultipleEdit}
        onClose={() => {
          onCloseMultipleEdit();
        }}
        classes={getCheckedClasses()}
        onRefresh={() => fetchData()}
      /> */}

      <Center>
        <Box p={4} w={'100%'} overflow='auto'>
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
              Editar selecionados
            </Button>
            <Button
              ml={2}
              colorScheme={'red'}
              onClick={handleDeleteSelectedClassesClick}
            >
              Remover selecioandos
            </Button>
          </Flex>
          <Dialog
            isOpen={isOpenDeleteClass}
            onClose={onCloseDeleteClass}
            onConfirm={handleDeleteClass}
            title={`Deseja remover ${selectedClass?.subject_code} - ${selectedClass?.code}`}
          />
          <Dialog
            isOpen={isOpenDeleteSelectedClasses}
            onClose={onCloseDeleteSelectedClasses}
            onConfirm={handleDeleteSelectedClasses}
            title={`Deseja remover todas as turmas selecionadas`}
            warningText='ATENÇÃO: QUALQUER TURMA SELECIONADA SERÁ PERDIDA!'
          />
          {/* <Dialog
            isOpen={isOpenDeleteAlloc}
            onClose={onCloseDeleteAlloc}
            onConfirm={handleDeleteAlloc}
            title={`Deseja remover a alocação de ${selectedClass?.subject_code} - ${selectedClass?.class_code}`}
            warningText='Atenção: ao confirmar a alocação dessa turma será perdida'
          /> */}
          <DataTable
            data={classes.map((cls, index) => ({ ...cls, index: index }))}
            columns={columns}
          />
        </Box>
      </Center>
    </>
  );
}

export default Classes;
