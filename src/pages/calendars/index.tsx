import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from 'components/common/NavBar/navbar.component';
import CalendarModal from './CalendarModal/calendar.modal';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import { useContext, useEffect, useState } from 'react';
import HolidaysCategoriesService from 'services/api/holidayCategory.service';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import useCustomToast from 'hooks/useCustomToast';
import CalendarAccordion from './CalendarAccordion/calendar.accordion';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import CalendarsService from 'services/api/calendars.service';
import CalendarViewModal from './CalendarViewModal/calendarView.modal';
import Dialog from 'components/common/Dialog/dialog.component';
import { appContext } from 'context/AppContext';

function Calendars() {
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

  const [categories, setCategories] = useState<HolidayCategoryResponse[]>([]);
  const [calendars, setCalendars] = useState<CalendarResponse[]>([]);
  const [isUpdateCalendar, setIsUpdateCalendar] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<
    CalendarResponse | undefined
  >(undefined);

  const { setLoading } = useContext(appContext);

  const calendarsService = new CalendarsService();
  const holidaysCategoriesService = new HolidaysCategoriesService();
  const showToast = useCustomToast();

  async function fetchData() {
    setLoading(true);
    await fetchCalendars();
    await fetchCategories();
    setLoading(false);
  }

  async function fetchCalendars() {
    await calendarsService.list().then((response) => {
      setCalendars(response.data);
    });
  }

  async function fetchCategories() {
    await holidaysCategoriesService.list().then((response) => {
      setCategories(response.data);
    });
  }

  async function createCalendar(data: CreateCalendar) {
    await calendarsService
      .create(data)
      .then((response) => {
        showToast(
          'Sucesso!',
          `Calendário ${data.name} criado com sucesso!`,
          'success',
        );
      })
      .catch((error) => {
        showToast('Erro', `Erro ao cadastrar calendário: ${error}`, 'error');
      })
      .finally(() => {
        fetchData();
      });
  }

  async function updateCalendar(id: number, data: UpdateCalendar) {
    await calendarsService
      .update(id, data)
      .then((response) => {
        showToast(
          'Sucesso!',
          `Calendário ${data.name} atualizado com sucesso!`,
          'success',
        );
      })
      .catch((error) => {
        showToast('Erro', `Erro ao atualizar calendário: ${error}`, 'error');
      })
      .finally(() => {
        fetchData();
      });
  }

  async function deleteCalendar() {
    if (!selectedCalendar) return;
    await calendarsService
      .delete(selectedCalendar.id)
      .then((response) => {
        showToast('Sucesso!', `Calendário deletado com sucesso!`, 'success');
      })
      .catch((error) => {
        showToast('Erro', `Erro ao deletar calendário: ${error}`, 'error');
      })
      .finally(() => {
        fetchData();
      });
  }

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

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Flex paddingX={10} paddingY={5} direction={'column'}>
        <Flex align={'center'}>
          <Text fontSize={'4xl'} mb={4}>
            Calendários
          </Text>
          <Spacer />
          <Button onClick={handleCreateCalendarButton} leftIcon={<AddIcon />}>
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
        <Dialog
          title={`Deseja o calendário ${selectedCalendar?.name}`}
          warningText={`Essa mudança é irreversível`}
          isOpen={isOpenDeleteCalendarDialog}
          onClose={() => {
            onCloseDeleteCalendarDialog();
            setSelectedCalendar(undefined);
          }}
          onConfirm={() => {
            deleteCalendar();
            setSelectedCalendar(undefined);
            onCloseDeleteCalendarDialog();
          }}
        />
      </Flex>
    </>
  );
}

export default Calendars;
