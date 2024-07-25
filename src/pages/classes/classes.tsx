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
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Loading from 'components/common/Loading/loading.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { appContext } from 'context/AppContext';
import { useContext, useState } from 'react';
import JupiterCrawlerModal from 'components/classes/jupiterCrawler.modal';
import { getClassesColumns } from './Tables/class.table';
import { ClassResponse } from 'models/http/responses/class.response.models';
import useClasses from 'hooks/useClasses';
import ClassModal from './ClassModal/class.modal';
import useSubjects from 'hooks/useSubjetcts';
import useCalendars from 'hooks/useCalendars';
import { Row } from '@tanstack/react-table';
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
    handleDuplicateClick,
    handleEditClick,
    handleAllocationEditClick,
    handleDeleteClassClick,
    checkMap,
  });

  function handleRegisterClick() {
    onOpenClassModal();
  }

  function handleDeleteClassClick(data: ClassResponse) {
    setSelectedClass(data);
    onOpenDeleteClass();
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
    onOpenAllocEdit();
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
          `Erro ao buscar disciplinas: ${response?.data.message}`,
          'error',
        ),
      )
      .finally(() => {
        setLoading(false);
      });
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
      <AllocateClassModal
        isOpen={isOpenAllocEdit}
        onClose={onCloseAllocEdit}
        refresh={getClasses}
        class_={selectedClass}
      />
      <JupiterCrawlerModal
        isOpen={isOpenJupiterModal}
        onClose={onCloseJupiterModal}
        successSubjects={successSubjects}
        failedSubjects={failedSubjects}
      />

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
          </Flex>
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
          <Dialog
            isOpen={isOpenDeleteClass}
            onClose={onCloseDeleteClass}
            onConfirm={handleDeleteClass}
            title={`Deseja remover ${selectedClass?.subject_code} - ${selectedClass?.code}`}
          />
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
