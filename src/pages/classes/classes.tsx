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
import { useContext, useState } from 'react';
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
import AllocateScheduleModal from 'components/allocation/allocateClassModal/allocateSingleScheduleSection';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { AllocateClassModal } from 'components/allocation/allocateClassModal';
import SubjectsService from 'services/api/subjects.service';
import { AxiosError } from 'axios';
import useCustomToast from 'hooks/useCustomToast';

function Classes() {
  const showToast = useCustomToast();

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
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse>();
  const [isUpdateClass, setIsUpdateClass] = useState(false);
  const { setLoading } = useContext(appContext);
  const [allocating, setAllocating] = useState(false);
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);

  const { subjects } = useSubjects();
  const { calendars } = useCalendars();
  const { classes, getClasses, deleteClass, deleteManyClass } = useClasses();

  const [checkMap, setCheckMap] = useState<boolean[]>(classes.map(() => false));

  const columns = getClassesColumns({
    handleCheckAllClick,
    handleCheckboxClick,
    handleDuplicateClick,
    handleEditClick,
    handleAllocationEditClick,
    handleDeleteClassClick,
    handleDeleteAllocClick,
    checkMap,
  });

  function handleRegisterClick() {
    onOpenClassModal();
  }

  function handleDeleteClassClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenDeleteClass();
  }

  function handleDeleteAllocClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenDeleteAlloc();
  }

  async function handleDeleteClass() {
    if (selectedClass) {
      await deleteClass(selectedClass.id);
      setSelectedClass(undefined);
      onCloseDeleteClass();
    }
  }

  function handleAllocationEditClick(data: ClassResponse) {
    setSelectedClass(data);
    setSelectedSchedule(data.schedules[1]);
    onOpenAllocEdit();
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

  function handleDuplicateClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenClassModal();
  }

  function handleEditClick(data: ClassResponse) {
    setSelectedClass(data);
    setIsUpdateClass(true);
    onOpenClassModal();
  }

  function handleCrawlerSave(subjectsList: string[], building_id: number) {
    setLoading(true);
    const subjectsService = new SubjectsService();

    subjectsService
      .crawl(building_id, subjectsList)
      .then((it) => {
        setSuccessSubjects(it.data.sucess);
        setFailedSubjects(it.data.failed);
        onOpenJupiterModal();
        getClasses();
        showToast(
          'Sucesso!',
          'Disciplinas foram carregadas com sucesso!',
          'success',
        );
      })
      .catch(({ response }: AxiosError<any>) =>
        showToast(
          'Erro!',
          `${response?.data.detail}`,
          'error',
        ),
      )
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDeleteSelectedClassesClick() {
    onOpenDeleteSelectedClasses();
  }

  function handleDeleteSelectedClasses() {
    const classes_ids = classes
      .filter((cls, index) => checkMap[index])
      .map((cls) => cls.id);
    deleteManyClass(classes_ids);
    setCheckMap((prev) => prev.filter((val) => !val));
    onCloseDeleteSelectedClasses();
  }

  function handleCheckAllClick(data: Row<ClassResponse>[], value: boolean) {
    const newCheckMap = [...checkMap];
    const filteredIds = data.map((cls) => Number(cls.original.id));
    filteredIds.forEach((id) => {
      const index = classes.findIndex((cls) => cls.id === id);
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
      <ClassModal
        isOpen={isOpenClassModal}
        onClose={() => {
          setSelectedClass(undefined);
          onCloseClassModal();
          setIsUpdateClass(false);
        }}
        isUpdate={isUpdateClass}
        refetch={getClasses}
        subjects={subjects}
        calendars={calendars}
        selectedClass={selectedClass}
      />
      {selectedClass && (
        <AllocateClassModal
          isOpen={isOpenAllocEdit}
          onClose={onCloseAllocEdit}
          refresh={getClasses}
          class_={selectedClass}
        />
      )}
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
              Excluir selecionados
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
