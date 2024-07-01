import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from 'components/common/NavBar/navbar.component';
import CalendarModal from './CalendarModal/calendar.modal';
import { useState } from 'react';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import CalendarViewModal from './CalendarViewModal/calendarView.modal';
import Dialog from 'components/common/Dialog/dialog.component';
import useCalendars from 'hooks/useCalendars';
import useHolidaysCategories from 'hooks/useHolidaysCategories';
import CalendarAccordion from './CalendarAccordion/calendar.accordion';
import HolidaysContentModal from './HolidaysContentModal/holidaysContent.modal';

function Calendars() {
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
    <>
      <Navbar />
      <Flex paddingX={10} paddingY={5} direction={'column'}>
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
            Adicionar Calendário
          </Button>
        </Flex>
        <CalendarAccordion
          calendars={calendars}
          onCalendarView={handleViewCalendarButton}
          onCalendarUpdate={handleEditCalendarButton}
          onCalendarDelete={handleDeleteCalendarButton}
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
          }}
          calendar={selectedCalendar}
        />
        <HolidaysContentModal
          isLoading={loadingCategories}
          isOpen={isOpenHolidaysModal}
          onClose={onCloseHolidaysModal}
          categories={categories}
          refetch={() => {
            getHolidaysCategories();
            getCalendars();
          }}
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
      </Flex>
    </>
  );
}

export default Calendars;
