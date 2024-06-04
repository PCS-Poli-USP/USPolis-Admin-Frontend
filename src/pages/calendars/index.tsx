import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from 'components/common/NavBar/navbar.component';
import CalendarModal from './CalendarModal/calendar.modal';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import { useEffect, useState } from 'react';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import HolidaysCategoriesService from 'services/api/holidayCategory.service';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import useCustomToast from 'hooks/useCustomToast';

function Calendars() {
  const {
    isOpen: isOpenCalendarModal,
    onOpen: onOpenCalendarModal,
    onClose: onCloseCalendarModal,
  } = useDisclosure();

  const [categories, setCategories] = useState<HolidayCategoryResponse[]>([]);

  const holidaysCategoriesService = new HolidaysCategoriesService();
  const showToast = useCustomToast();

  function handleCreateCalendarButton() {
    onOpenCalendarModal();
  }
  function createCalendar(data: CreateCalendar) {}
  function updateCalendar(id: number, data: UpdateCalendar) {}

  async function fetchData() {
    await holidaysCategoriesService.list().then((response) => {
      setCategories(response.data);
      showToast('Categorias carregadas', 'Sucesso', 'success');
    });
  }

  useEffect(() => {
    fetchData();
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
            Adicionar categoria
          </Button>
        </Flex>
        <CalendarModal
          isUpdate={false}
          categories={categories}
          onCreate={createCalendar}
          onUpdate={updateCalendar}
          isOpen={isOpenCalendarModal}
          onClose={() => {
            console.log('Fecha');
            onCloseCalendarModal();
          }}
        />
      </Flex>
    </>
  );
}

export default Calendars;
