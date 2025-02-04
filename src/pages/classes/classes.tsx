import {
  Box,
  Button,
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
import { appContext } from 'context/AppContext';
import { useContext, useState } from 'react';
import { EventByClassrooms } from 'models/common/event.model';
import JupiterCrawlerModal from 'components/classes/jupiterCrawler.modal';
import MultipleEditModal from 'components/classes/multipleEdit.modal';
import { getClassesColumns } from './Tables/class.table';
import { ClassResponse } from 'models/http/responses/class.response.models';
import useClasses from 'hooks/useClasses';
import ClassModal from './ClassModal/class.modal';
import useSubjects from 'hooks/useSubjetcts';
import useCalendars from 'hooks/useCalendars';
import { Row } from '@tanstack/react-table';
import AllocateScheduleModal from './AllocateClassModal/allocateSingleScheduleSection';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { AllocateClassModal } from './AllocateClassModal';
import { AxiosError } from 'axios';
import useCustomToast from 'hooks/useCustomToast';
import ClassOccurrencesModal from './ClassOccurrencesModal';
import PageContent from 'components/common/PageContent';
import useSubjectsService from 'hooks/API/services/useSubjectsService';

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
    isOpen: isOpenOccurrencesModal,
    onOpen: onOpenOccurrencesModal,
    onClose: onCloseOccurrencesModal,
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

  const subjectsService = useSubjectsService();

  const [selectedClass, setSelectedClass] = useState<ClassResponse>();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse>();
  const [isUpdateClass, setIsUpdateClass] = useState(false);
  const { setLoading } = useContext(appContext);
  const [isCrawling, setIsCrawling] = useState(false);
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);

  const { subjects, getSubjects } = useSubjects();
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
    handleEditOccurrencesClick,
    checkMap,
  });

  function handleRegisterClick() {
    onOpenClassModal();
  }

  function handleDeleteClassClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenDeleteClass();
  }

  function handleEditOccurrencesClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenOccurrencesModal();
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

  function handleDuplicateClick(data: ClassResponse) {
    const selected: ClassResponse = {
      ...data,
      professors: [...data.professors],
      schedules: data.schedules.map((schedule) => {
        return { ...schedule, allocated: false };
      }),
    };
    setSelectedClass(selected);
    setIsUpdateClass(false);
    onOpenClassModal();
  }

  function handleEditClick(data: ClassResponse) {
    setSelectedClass(data);
    setIsUpdateClass(true);
    onOpenClassModal();
  }

  async function handleCrawlerSave(
    subjectsList: string[],
    building_id: number,
    calendar_ids: number[],
  ) {
    setLoading(true);
    setIsCrawling(true);
    await subjectsService
      .crawl(building_id, { subject_codes: subjectsList, calendar_ids })
      .then((it) => {
        setSuccessSubjects(it.data.sucess);
        setFailedSubjects(it.data.failed);
        onOpenJupiterModal();
        getClasses();
        getSubjects();
        showToast('Sucesso!', 'Disciplinas carregadas com sucesso!', 'success');
      })
      .catch(({ response }: AxiosError<any>) =>
        showToast('Erro!', `${response?.data.detail}`, 'error'),
      )
      .finally(() => {
        setLoading(false);
        setIsCrawling(false);
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
    <PageContent>
      <Loading isOpen={isCrawling} onClose={() => setIsCrawling(false)} />
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
      {selectedClass && (
        <ClassOccurrencesModal
          selectedClass={selectedClass}
          isOpen={isOpenOccurrencesModal}
          onClose={() => {
            setSelectedClass(undefined);
            onCloseOccurrencesModal();
          }}
        />
      )}
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
        title={`Deseja remover todas as turmas selecionadas (${
          checkMap.filter((val) => val).length
        })`}
        warningText={`ATENÇÃO: QUALQUER TURMA SELECIONADA SERÁ PERDIDA! ${
          checkMap.filter((val) => val).length
        } TURMAS SERÃO REMOVIDAS!`}
      />
      <DataTable
        data={classes.map((cls, index) => ({ ...cls, index: index }))}
        columns={columns}
        columnPinning={{
          left: ['mark', 'subject_code', 'code'],
          right: ['options'],
        }}
      />
    </PageContent>
  );
}

export default Classes;
