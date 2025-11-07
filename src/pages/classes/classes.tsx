import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';
import Loading from '../../components/common/Loading/loading.component';
import { useContext, useEffect, useRef, useState } from 'react';
import { getClassesColumns } from './Tables/class.table';
import { ClassResponse } from '../../models/http/responses/class.response.models';
import useClasses from '../../hooks/classes/useClasses';
import ClassModal from './ClassModal/class.modal';
import useSubjects from '../../hooks/useSubjetcts';
import useCalendars from '../../hooks/useCalendars';
import { Row } from '@tanstack/react-table';
import { ScheduleResponse } from '../../models/http/responses/schedule.response.models';
import { AllocateClassModal } from './AllocateClassModal';
import ClassOccurrencesModal from './ClassOccurrencesModal';
import PageContent from '../../components/common/PageContent';
import CrawlerUpdateModal from './CrawlerUpdateModal/crawler.update.modal';
import useCrawler from '../../hooks/useCrawler';
import { appContext } from '../../context/AppContext';
import { UsersValidator } from '../../utils/users/users.validator';
import CrawlerResultModal from './CrawlerModal/crawler.result.modal';
import { CrawlerType } from '../../utils/enums/subjects.enum';
import PageHeaderWithFilter from '../../components/common/PageHeaderWithFilter';
import usePageHeaderWithFilter from '../../components/common/PageHeaderWithFilter/usePageHeaderWithFilter';
import { LuDownload, LuHand, LuTimer } from 'react-icons/lu';
import CrawlerJupiterModal from './CrawlerModal/crawler.jupiter.modal';
import { AddIcon } from '@chakra-ui/icons';
import { IoTrashBinOutline } from 'react-icons/io5';
import AllocationReuseModal from './AllocationReuseModal/allocation.reuse.modal';

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
  const {
    isOpen: isOpenCrawlerJupiterModal,
    onOpen: onOpenCrawlerJupiterModal,
    onClose: onCloseCrawlerJupiterModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocationReuseModal,
    onOpen: onOpenAllocationReuseModal,
    onClose: onCloseAllocationReuseModal,
  } = useDisclosure();

  const { start, setStart, end, setEnd } = usePageHeaderWithFilter();

  const [selectedClass, setSelectedClass] = useState<ClassResponse | undefined>(
    undefined,
  );
  const [, setSelectedSchedule] = useState<ScheduleResponse | undefined>(
    undefined,
  );
  const [isUpdateClass, setIsUpdateClass] = useState(false);
  const [crawlerType, setCrawlerType] = useState<CrawlerType | undefined>(
    CrawlerType.JUPITER,
  );

  const { loading: loadingSubjects, subjects, getSubjects } = useSubjects();
  const { calendars, loading: loadingCalendars } = useCalendars();
  const { loading, classes, getClasses, deleteClass, deleteManyClass } =
    useClasses();
  const originalClasses = useRef<ClassResponse[]>([]);

  const { loading: isCrawling, result, create, update } = useCrawler();

  const [checkMap, setCheckMap] = useState<boolean[]>(classes.map(() => false));
  const validator = new UsersValidator(context.loggedUser);
  const disableMap = classes.map((cls) => {
    return !validator.checkUserClassPermission(cls);
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
      .filter((_, index) => checkMap[index])
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

  useEffect(() => {
    if (!originalClasses.current.length) {
      originalClasses.current = classes;
    }
  }, [classes]);

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
        refetch={() => getClasses(start, end)}
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
      <CrawlerResultModal
        isOpen={isOpenJupiterModal}
        onClose={onCloseJupiterModal}
        data={result}
        type={crawlerType}
      />
      {selectedClass && (
        <AllocateClassModal
          isOpen={isOpenAllocEdit}
          onClose={onCloseAllocEdit}
          refresh={() => getClasses(start, end)}
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
      <CrawlerJupiterModal
        subjects={subjects}
        isOpen={isOpenCrawlerJupiterModal}
        onClose={onCloseCrawlerJupiterModal}
        onSave={handleCrawlerSave}
        crawlerType={crawlerType}
        setCrawlerType={setCrawlerType}
        calendars={calendars}
        loadingCalendars={loadingCalendars}
      />
      <AllocationReuseModal
        isOpen={isOpenAllocationReuseModal}
        onClose={onCloseAllocationReuseModal}
        data={undefined}
        subjects={subjects}
        classes={originalClasses.current}
        buildings={context.loggedUser ? context.loggedUser.buildings || [] : []}
      />
      <Flex align='center'>
        <PageHeaderWithFilter
          title='Turmas'
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          onConfirm={(start, end) => {
            getClasses(start, end);
          }}
        />
        <Spacer />
        <Menu>
          <MenuButton
            as={Button}
            colorScheme='blue'
            leftIcon={<AddIcon />}
            borderRadius={'20px'}
          >
            Opções
          </MenuButton>
          <MenuList w={'300px'} border={'1px'} bgColor={'uspolis.white'}>
            <MenuGroup title='Adição' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                bgColor={'uspolis.white'}
                justifyContent={'flex-start'}
                onClick={handleRegisterClick}
                leftIcon={<LuHand />}
                _hover={{ textColor: 'uspolis.white' }}
              >
                Manual
              </MenuItem>
              <MenuDivider />
              <MenuItem
                as={Button}
                bgColor={'uspolis.white'}
                justifyContent={'flex-start'}
                leftIcon={<LuTimer />}
                onClick={onOpenCrawlerJupiterModal}
                _hover={{ textColor: 'uspolis.white' }}
              >
                Júpiter/Janus
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Atualizar' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                bgColor={'uspolis.white'}
                justifyContent={'flex-start'}
                onClick={onOpenJupiterUpdateModal}
                leftIcon={<LuTimer />}
                _hover={{ textColor: 'uspolis.white' }}
              >
                Júpiter/Janus
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Remover' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                justifyContent={'flex-start'}
                bgColor={'uspolis.white'}
                onClick={handleDeleteSelectedClassesClick}
                leftIcon={<IoTrashBinOutline />}
                _hover={{ textColor: 'uspolis.white' }}
              >
                Selecionados
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Alocações' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                justifyContent={'flex-start'}
                bgColor={'uspolis.white'}
                onClick={() => {
                  onOpenAllocationReuseModal();
                }}
                leftIcon={<LuDownload />}
                _hover={{ textColor: 'uspolis.white' }}
                isLoading={loading || loadingSubjects || context.loading}
              >
                Reaproveitar
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
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
