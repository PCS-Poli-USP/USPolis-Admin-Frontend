import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import CalendarModal from './CalendarModal/calendar.modal';
import { useContext, useState } from 'react';
import { CalendarResponse } from '../../models/http/responses/calendar.responde.models';
import CalendarViewModal from './CalendarViewModal/calendarView.modal';
import Dialog from '../../components/common/Dialog/dialog.component';
import useCalendars from '../../hooks/useCalendars';
import useHolidaysCategories from '../../hooks/useHolidaysCategories';
import CalendarAccordion from './CalendarAccordion/calendar.accordion';
import HolidaysContentModal from './HolidaysContentModal/holidaysContent.modal';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';

function Calendars() {
  const { loggedUser } = useContext(appContext);

  const {
    isOpen: isOpenHolidaysModal,
    onOpen: onOpenHolidaysModal,
    onClose: onCloseHolidaysModal,
  } = useDisclosure();
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
    isOpen: isOpenDeleteCalendarDialog,
    onOpen: onOpenDeleteCalendarDialog,
    onClose: onCloseDeleteCalendarDialog,
  } = useDisclosure();

  const {
    holidaysCategories: categories,
    getHolidaysCategories,
    loading: loadingCategories,
  } = useHolidaysCategories();

  const {
    loading: loadingCalendars,
    calendars,
    getCalendars,
    createCalendar,
    updateCalendar,
    deleteCalendar,
  } = useCalendars();

  const [isUpdateCalendar, setIsUpdateCalendar] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<
    CalendarResponse | undefined
  >(undefined);

  function handleCreateCalendarButton() {
    onOpenCalendarModal();
  }

  function handleViewCalendarButton(data: CalendarResponse) {
    setSelectedCalendar(data);
    onOpenCalendarViewModal();
  }

  function handleEditCalendarButton(data: CalendarResponse) {
    setSelectedCalendar(data);
    setIsUpdateCalendar(true);
    onOpenCalendarModal();
  }

  function handleDeleteCalendarButton(data: CalendarResponse) {
    setSelectedCalendar(data);
    onOpenDeleteCalendarDialog();
  }

  function handleDeleteCalendar() {
    if (selectedCalendar) {
      deleteCalendar(selectedCalendar.id);
      setSelectedCalendar(undefined);
      onCloseDeleteCalendarDialog();
    }
  }

  return (
    <PageContent>
      <Flex align={'center'}>
        <Text fontSize={'4xl'} mb={4}>
          Calendários
        </Text>
        <Spacer />
        <Button
          mr={2}
          colorScheme={'blue'}
          onClick={() => {
            onOpenHolidaysModal();
          }}
        >
          Feriados e Categorias
        </Button>
        <Button
          colorScheme={'blue'}
          onClick={handleCreateCalendarButton}
          leftIcon={<AddIcon />}
        >
          Calendário
        </Button>
      </Flex>
      <CalendarAccordion
        loading={loadingCalendars}
        calendars={calendars}
        onCalendarView={handleViewCalendarButton}
        onCalendarUpdate={handleEditCalendarButton}
        onCalendarDelete={handleDeleteCalendarButton}
        loggedUser={loggedUser}
      />
      <CalendarModal
        isUpdate={isUpdateCalendar}
        categories={categories}
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
      <HolidaysContentModal
        isLoading={loadingCategories}
        isOpen={isOpenHolidaysModal}
        onClose={() => {
          onCloseHolidaysModal();
        }}
        categories={categories}
        refetch={() => {
          getHolidaysCategories();
          getCalendars();
        }}
        loggedUser={loggedUser}
      />
      <Dialog
        title={`Deseja o calendário ${selectedCalendar?.name}`}
        warningText={`Essa mudança é irreversível`}
        isOpen={isOpenDeleteCalendarDialog}
        onClose={() => {
          onCloseDeleteCalendarDialog();
          setSelectedCalendar(undefined);
        }}
        onConfirm={handleDeleteCalendar}
      />
    </PageContent>
  );
}

export default Calendars;
