import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import DataTable from 'components/common/DataTable/dataTable.component';
import Dialog from 'components/common/Dialog/dialog.component';
import Loading from 'components/common/Loading/loading.component';
import { useContext, useState } from 'react';
import { getClassesColumns } from './Tables/class.table';
import { ClassResponse } from 'models/http/responses/class.response.models';
import useClasses from 'hooks/classes/useClasses';
import ClassModal from './ClassModal/class.modal';
import useSubjects from 'hooks/useSubjetcts';
import useCalendars from 'hooks/useCalendars';
import { Row } from '@tanstack/react-table';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { AllocateClassModal } from './AllocateClassModal';
import ClassOccurrencesModal from './ClassOccurrencesModal';
import PageContent from 'components/common/PageContent';
import CrawlerUpdateModal from './CrawlerUpdateModal/crawler.update.modal';
import useCrawler from 'hooks/useCrawler';
import { appContext } from 'context/AppContext';
import { UsersValidator } from 'utils/users/users.validator';
import CrawlerModal from './CrawlerModal/crawler.modal';
import CrawlerPopover from './CrawlerModal/crawler.popover';
import { CrawlerType } from 'utils/enums/subjects.enum';

function Classes() {
  const context = useContext(appContext);

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
    isOpen: isOpenJupiterUpdateModal,
    onOpen: onOpenJupiterUpdateModal,
    onClose: onCloseJupiterUpdateModal,
  } = useDisclosure();
  const {
    isOpen: isOpenJupiterModal,
    onOpen: onOpenJupiterModal,
    onClose: onCloseJupiterModal,
  } = useDisclosure();

  const [selectedClass, setSelectedClass] = useState<ClassResponse>();
  const [, setSelectedSchedule] = useState<ScheduleResponse>();
  const [isUpdateClass, setIsUpdateClass] = useState(false);
  const [crawlerType, setCrawlerType] = useState<CrawlerType | undefined>(
    CrawlerType.JUPITER,
  );

  const { subjects, getSubjects } = useSubjects();
  const { calendars } = useCalendars();
  const { loading, classes, getClasses, deleteClass, deleteManyClass } =
    useClasses();
  const { loading: isCrawling, result, create, update } = useCrawler();

  const [checkMap, setCheckMap] = useState<boolean[]>(classes.map(() => false));
  const disableMap = classes.map((cls) => {
    return !UsersValidator.checkUserPermissionOnClass(context.loggedUser, cls);
  });

  const columns = getClassesColumns({
    handleCheckAllClick,
    handleCheckboxClick,
    handleDuplicateClick,
    handleEditClick,
    handleAllocationEditClick,
    handleDeleteClassClick,
    handleEditOccurrencesClick,
    checkMap,
    disableMap,
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
    type: CrawlerType,
  ) {
    await create(building_id, {
      subject_codes: subjectsList,
      calendar_ids,
      type,
    });
    onOpenJupiterModal();
    getClasses();
    getSubjects();
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

  async function handleUpdateJupiterConfirm(codes: string[]) {
    await update({ subject_codes: codes });
    onCloseJupiterUpdateModal();
    onOpenJupiterModal();
    getClasses();
  }

  return (
    <PageContent>
      <Loading isOpen={isCrawling} onClose={() => {}} />
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
      <CrawlerUpdateModal
        codes={classes
          .map((cls) => cls.subject_code)
          .filter((value, index, self) => self.indexOf(value) === index)}
        isOpen={isOpenJupiterUpdateModal}
        onClose={onCloseJupiterUpdateModal}
        handleConfirm={handleUpdateJupiterConfirm}
        loading={isCrawling}
        type={crawlerType}
        setCrawlerType={setCrawlerType}
      />
      <CrawlerModal
        isOpen={isOpenJupiterModal}
        onClose={onCloseJupiterModal}
        data={result}
        type={crawlerType}
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
        <CrawlerPopover
          onSave={handleCrawlerSave}
          crawlerType={crawlerType}
          setCrawlerType={setCrawlerType}
        />

        <Button
          ml={'5px'}
          colorScheme={'blue'}
          onClick={onOpenJupiterUpdateModal}
        >
          Atualizar pelo Jupiter / Janus
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
        warningText='ATENÇÃO: TODOS OS DADOS DA TURMA SERÃO PERDIDOS, ASSIM COMO AS INFORMAÇÕES NO APLICATIVO'
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
        loading={loading}
        data={classes.map((cls, index) => ({ ...cls, index: index }))}
        columns={columns}
        columnPinning={{
          left: ['id', 'mark', 'subject_code', 'code'],
          right: ['options'],
        }}
      />
    </PageContent>
  );
}

export default Classes;
