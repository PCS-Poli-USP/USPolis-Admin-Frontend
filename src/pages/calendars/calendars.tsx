import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useContext, useMemo, useState } from 'react';
import PageContent from '../../components/common/PageContent';
import Dialog from '../../components/common/Dialog/dialog.component';
import { appContext } from '../../context/AppContext';
import useCalendars from '../../hooks/useCalendars';
import useHolidays from '../../hooks/useHolidays';
import useHolidaysCategories from '../../hooks/useHolidaysCategories';
import { CalendarResponse } from '../../models/http/responses/calendar.responde.models';
import { HolidayCategoryResponse } from '../../models/http/responses/holidayCategory.response.models';
import { HolidayResponse } from '../../models/http/responses/holiday.response.models';
import { sortCalendarResponse } from '../../utils/calendars/calendar.sorter';
import { isoToBRDate } from '../../utils/calendars/calendar.formatter';
import { sortHolidaysCategoriesResponse } from '../../utils/holidaysCategories/holidaysCategories.sorter';
import { buildHolidayCategoryColorMap } from '../../utils/holidaysCategories/holidaysCategories.colors';
import CalendarCard from './CalendarCard/calendar.card';
import CalendarModal from './CalendarModal/calendar.modal';
import CalendarViewModal from './CalendarViewModal/calendarView.modal';
import HolidayCategoryModal from './HolidayCategoryModal';
import HolidayModal from './HolidayModal';
import HolidaysTab from './HolidaysTab/holidays.tab';
import YearSelector from './YearSelector/year.selector';

const segmentedTabStyle = {
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: 'uspolis.textMuted',
  _selected: {
    bg: 'uspolis.white',
    color: 'uspolis.text',
    fontWeight: 'bold',
    boxShadow: 'sm',
  },
  _hover: { color: 'uspolis.text' },
};

function Calendars() {
  const { loggedUser } = useContext(appContext);

  const [year, setYear] = useState(new Date().getFullYear());
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [isUpdateCalendar, setIsUpdateCalendar] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);
  const [isUpdateHoliday, setIsUpdateHoliday] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<
    CalendarResponse | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    HolidayCategoryResponse | undefined
  >(undefined);
  const [selectedHoliday, setSelectedHoliday] = useState<
    HolidayResponse | undefined
  >(undefined);

  const {
    isOpen: isOpenCalendarModal,
    onOpen: onOpenCalendarModal,
    onClose: onCloseCalendarModal,
  } = useDisclosure();
  const {
    isOpen: isOpenCalendarViewModal,
    onOpen: onOpenCalendarViewModal,
    onClose: onCloseCalendarViewModal,
  } = useDisclosure();
  const {
    isOpen: isOpenCategoryModal,
    onOpen: onOpenCategoryModal,
    onClose: onCloseCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenHolidayModal,
    onOpen: onOpenHolidayModal,
    onClose: onCloseHolidayModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteCalendarDialog,
    onOpen: onOpenDeleteCalendarDialog,
    onClose: onCloseDeleteCalendarDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteCategoryDialog,
    onOpen: onOpenDeleteCategoryDialog,
    onClose: onCloseDeleteCategoryDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteHolidayDialog,
    onOpen: onOpenDeleteHolidayDialog,
    onClose: onCloseDeleteHolidayDialog,
  } = useDisclosure();

  const {
    loading: loadingCalendars,
    calendars,
    getCalendars,
    createCalendar,
    updateCalendar,
    deleteCalendar,
  } = useCalendars();

  const {
    loading: loadingCategories,
    holidaysCategories,
    getHolidaysCategories,
    deleteHolidayCategory,
  } = useHolidaysCategories();

  const { deleteHoliday } = useHolidays(false);

  function refetchAll() {
    getHolidaysCategories();
    getCalendars();
  }

  const yearCalendars = useMemo(
    () =>
      calendars
        .filter((calendar) => calendar.year === year)
        .sort(sortCalendarResponse),
    [calendars, year],
  );

  const yearCategories = useMemo(
    () =>
      holidaysCategories
        .filter((category) => category.year === year)
        .sort(sortHolidaysCategoriesResponse),
    [holidaysCategories, year],
  );

  const colorMap = useMemo(
    () => buildHolidayCategoryColorMap(yearCategories),
    [yearCategories],
  );

  const holidaysCount = yearCategories.reduce(
    (total, category) => total + category.holidays.length,
    0,
  );

  function handleChangeYear(value: number) {
    setYear(value);
    setSelectedCategoryId(null);
  }

  function handleCreateCalendar() {
    setIsUpdateCalendar(false);
    setSelectedCalendar(undefined);
    onOpenCalendarModal();
  }

  function handleViewCalendar(calendar: CalendarResponse) {
    setSelectedCalendar(calendar);
    onOpenCalendarViewModal();
  }

  function handleUpdateCalendar(calendar: CalendarResponse) {
    setSelectedCalendar(calendar);
    setIsUpdateCalendar(true);
    onOpenCalendarModal();
  }

  function handleDeleteCalendarClick(calendar: CalendarResponse) {
    setSelectedCalendar(calendar);
    onOpenDeleteCalendarDialog();
  }

  function handleDeleteCalendar() {
    if (selectedCalendar) {
      deleteCalendar(selectedCalendar.id);
      setSelectedCalendar(undefined);
      onCloseDeleteCalendarDialog();
    }
  }

  function handleCreateCategory() {
    setIsUpdateCategory(false);
    setSelectedCategory(undefined);
    onOpenCategoryModal();
  }

  function handleUpdateCategory(category: HolidayCategoryResponse) {
    setSelectedCategory(category);
    setIsUpdateCategory(true);
    onOpenCategoryModal();
  }

  function handleDeleteCategoryClick(category: HolidayCategoryResponse) {
    setSelectedCategory(category);
    onOpenDeleteCategoryDialog();
  }

  async function handleDeleteCategory() {
    if (selectedCategory) {
      await deleteHolidayCategory(selectedCategory.id);
      if (selectedCategoryId === selectedCategory.id) {
        setSelectedCategoryId(null);
      }
      setSelectedCategory(undefined);
      onCloseDeleteCategoryDialog();
      getCalendars();
    }
  }

  function handleCreateHoliday() {
    setIsUpdateHoliday(false);
    setSelectedHoliday(undefined);
    onOpenHolidayModal();
  }

  function handleUpdateHoliday(holiday: HolidayResponse) {
    setSelectedHoliday(holiday);
    setIsUpdateHoliday(true);
    onOpenHolidayModal();
  }

  function handleDeleteHolidayClick(holiday: HolidayResponse) {
    setSelectedHoliday(holiday);
    onOpenDeleteHolidayDialog();
  }

  async function handleDeleteHoliday() {
    if (selectedHoliday) {
      await deleteHoliday(selectedHoliday.id);
      setSelectedHoliday(undefined);
      onCloseDeleteHolidayDialog();
      refetchAll();
    }
  }

  const selectedCategoryForModal = yearCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  // Ao editar, o modal precisa da categoria do proprio feriado (e dela que sai
  // a lista de dias ja ocupados). Ao cadastrar, usa a categoria filtrada na
  // barra lateral ou, na falta dela, a primeira categoria do ano.
  const holidayModalCategory =
    isUpdateHoliday && selectedHoliday
      ? yearCategories.find(
          (category) => category.id === selectedHoliday.category_id,
        )
      : (selectedCategoryForModal ?? yearCategories[0]);

  return (
    <PageContent>
      <VStack align={'stretch'} spacing={'18px'}>
        <Flex align={'center'} gap={5} wrap={'wrap'}>
          <Heading size={'lg'} color={'uspolis.text'} fontWeight={'normal'}>
            Calendários
          </Heading>
          <YearSelector year={year} onChange={handleChangeYear} />
          <Spacer />
          <HStack spacing={'10px'}>
            <Button
              variant={'outline'}
              colorScheme={'blue'}
              leftIcon={<AddIcon />}
              onClick={handleCreateCategory}
            >
              Categoria
            </Button>
            <Button
              colorScheme={'blue'}
              leftIcon={<AddIcon />}
              onClick={handleCreateCalendar}
            >
              Calendário
            </Button>
          </HStack>
        </Flex>

        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant={'soft-rounded'}
          colorScheme={'teal'}
        >
          <TabList
            w={'fit-content'}
            bg={'uspolis.surfaceSubtle'}
            borderRadius={'8px'}
            p={'3px'}
            gap={'2px'}
          >
            <Tab {...segmentedTabStyle}>
              <HStack spacing={'7px'}>
                <Text>Calendários</Text>
                <Text fontSize={'12px'} opacity={0.65}>
                  {yearCalendars.length}
                </Text>
              </HStack>
            </Tab>
            <Tab {...segmentedTabStyle}>
              <HStack spacing={'7px'}>
                <Text>Feriados e Categorias</Text>
                <Text fontSize={'12px'} opacity={0.65}>
                  {holidaysCount}
                </Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Skeleton isLoaded={!loadingCalendars}>
                <SimpleGrid
                  minChildWidth={'360px'}
                  spacing={4}
                  alignItems={'stretch'}
                >
                  {yearCalendars.map((calendar) => (
                    <CalendarCard
                      key={calendar.id}
                      calendar={calendar}
                      loggedUser={loggedUser}
                      colorMap={colorMap}
                      onView={handleViewCalendar}
                      onUpdate={handleUpdateCalendar}
                      onDelete={handleDeleteCalendarClick}
                    />
                  ))}
                  <Button
                    minH={'190px'}
                    h={'auto'}
                    variant={'outline'}
                    colorScheme={'blue'}
                    borderStyle={'dashed'}
                    borderWidth={'1.5px'}
                    borderRadius={'10px'}
                    whiteSpace={'normal'}
                    onClick={handleCreateCalendar}
                  >
                    <VStack spacing={'6px'}>
                      <Text fontSize={'26px'} lineHeight={1}>
                        +
                      </Text>
                      <Text>{`Novo calendário para ${year}`}</Text>
                    </VStack>
                  </Button>
                </SimpleGrid>

                {yearCalendars.length === 0 && (
                  <Alert
                    status={'warning'}
                    fontSize={'sm'}
                    mt={4}
                    borderRadius={'6px'}
                  >
                    <AlertIcon />
                    {`Nenhum calendário adicionado em ${year}`}
                  </Alert>
                )}
              </Skeleton>
            </TabPanel>

            <TabPanel px={0}>
              <HolidaysTab
                loading={loadingCategories}
                year={year}
                categories={yearCategories}
                colorMap={colorMap}
                loggedUser={loggedUser}
                selectedCategoryId={selectedCategoryId}
                search={search}
                onSearch={setSearch}
                onSelectCategory={setSelectedCategoryId}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategoryClick}
                onCreateHoliday={handleCreateHoliday}
                onUpdateHoliday={handleUpdateHoliday}
                onDeleteHoliday={handleDeleteHolidayClick}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <CalendarModal
        isUpdate={isUpdateCalendar}
        categories={holidaysCategories}
        selectedCalendar={selectedCalendar}
        onCreate={createCalendar}
        onUpdate={updateCalendar}
        isOpen={isOpenCalendarModal}
        onClose={() => {
          onCloseCalendarModal();
          setSelectedCalendar(undefined);
          setIsUpdateCalendar(false);
        }}
      />

      <CalendarViewModal
        isOpen={isOpenCalendarViewModal}
        onClose={() => {
          onCloseCalendarViewModal();
          setSelectedCalendar(undefined);
        }}
        calendar={selectedCalendar}
      />

      <HolidayCategoryModal
        isUpdate={isUpdateCategory}
        selectedHolidayCategory={selectedCategory}
        refetch={refetchAll}
        isOpen={isOpenCategoryModal}
        onClose={() => {
          onCloseCategoryModal();
          setSelectedCategory(undefined);
          setIsUpdateCategory(false);
        }}
      />

      <HolidayModal
        isUpdate={isUpdateHoliday}
        categories={yearCategories}
        category={holidayModalCategory}
        selectedHoliday={selectedHoliday}
        refetch={refetchAll}
        isOpen={isOpenHolidayModal}
        onClose={() => {
          onCloseHolidayModal();
          setSelectedHoliday(undefined);
          setIsUpdateHoliday(false);
        }}
      />

      <Dialog
        title={`Deletar o calendário ${selectedCalendar?.name} (${selectedCalendar?.year})`}
        warningText={'Essa mudança é irreversível.'}
        isOpen={isOpenDeleteCalendarDialog}
        onClose={() => {
          onCloseDeleteCalendarDialog();
          setSelectedCalendar(undefined);
        }}
        onConfirm={handleDeleteCalendar}
      />

      <Dialog
        title={`Deletar a categoria ${selectedCategory?.name} (${selectedCategory?.year})`}
        warningText={
          'Essa mudança é irreversível e irá apagar todos os feriados dessa categoria, juntamente com as alocações desses dias!'
        }
        isOpen={isOpenDeleteCategoryDialog}
        onClose={() => {
          onCloseDeleteCategoryDialog();
          setSelectedCategory(undefined);
        }}
        onConfirm={handleDeleteCategory}
      />

      <Dialog
        title={`Deletar o feriado ${selectedHoliday?.name} (${
          selectedHoliday ? isoToBRDate(selectedHoliday.date) : ''
        })`}
        warningText={
          'Essa mudança é irreversível e irá permitir alocações nesse dia!'
        }
        isOpen={isOpenDeleteHolidayDialog}
        onClose={() => {
          onCloseDeleteHolidayDialog();
          setSelectedHoliday(undefined);
        }}
        onConfirm={handleDeleteHoliday}
      />
    </PageContent>
  );
}

export default Calendars;
