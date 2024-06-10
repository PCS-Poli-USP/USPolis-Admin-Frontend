import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from 'components/common/NavBar/navbar.component';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useState } from 'react';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import HolidayCategoryModal from './HolidayCategoryModal';
import HolidayModal from './HolidayModal';
import Dialog from 'components/common/Dialog/dialog.component';
import { datetimeToDate } from 'utils/formatters';
import HolidayCategoryAccordion from './HolidayCategoryAccordion';
import { AddIcon } from '@chakra-ui/icons';
import useHolidaysCategories from 'hooks/useHolidaysCategories';
import useHolidays from 'hooks/useHolidays';

function Holidays() {
  const {
    isOpen: isOpenHolidayCategoryModal,
    onOpen: onOpenHolidayCategoryModal,
    onClose: onCloseHolidayCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenHolidayModal,
    onOpen: onOpenHolidayModal,
    onClose: onCloseHolidayModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteHolidayCategoryDialog,
    onOpen: onOpenDeleteHolidayCategoryDialog,
    onClose: onCloseDeleteHolidayCategoryDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteHolidayDialog,
    onOpen: onOpenDeleteHolidayDialog,
    onClose: onCloseDeleteHolidayDialog,
  } = useDisclosure();

  const [selectedHolidayCategory, setSelectedHolidayCategory] = useState<
    HolidayCategoryResponse | undefined
  >(undefined);
  const [selectedHoliday, setSelectedHoliday] = useState<
    HolidayUnfetchResponse | undefined
  >(undefined);
  const [isUpdateHolidayCategory, setIsUpdateHolidayCategory] = useState(false);
  const [isUpdateHoliday, setIsUpdateHoliday] = useState(false);

  const {
    loading: loadingCategories,
    holidaysCategories,
    getHolidaysCategories,
    deleteHolidayCategory,
  } = useHolidaysCategories();

  const { deleteHoliday } = useHolidays();

  function handleCreateHolidayCategoryButton() {
    onOpenHolidayCategoryModal();
  }

  function handleEditHolidayCategoryButton(data: HolidayCategoryResponse) {
    setSelectedHolidayCategory(data);
    setIsUpdateHolidayCategory(true);
    onOpenHolidayCategoryModal();
  }

  function handleDeleteHolidayCategoryButton(data: HolidayCategoryResponse) {
    setSelectedHolidayCategory(data);
    onOpenDeleteHolidayCategoryDialog();
  }

  function handleDeleteHolidayCategory() {
    if (!selectedHolidayCategory) return;
    deleteHolidayCategory(selectedHolidayCategory.id);
    getHolidaysCategories();
  }

  function handleCreateHolidayButton(category: HolidayCategoryResponse) {
    setSelectedHolidayCategory(category);
    onOpenHolidayModal();
  }

  function handleEditHolidayButton(data: HolidayUnfetchResponse) {
    setSelectedHoliday(data);
    setIsUpdateHoliday(true);
    onOpenHolidayModal();
  }

  function handleDeleteHolidayButton(data: HolidayUnfetchResponse) {
    setSelectedHoliday(data);
    onOpenDeleteHolidayDialog();
  }

  function handleDeleteHoliday() {
    if (!selectedHoliday) return;
    deleteHoliday(selectedHoliday.id);
    getHolidaysCategories();
  }

  return (
    <>
      <Navbar />
      <Flex paddingX={10} paddingY={5} direction={'column'}>
        <Flex align={'center'}>
          <Text fontSize={'4xl'} mb={4}>
            Feriados e Categorias
          </Text>
          <Spacer />
          <Button
            onClick={handleCreateHolidayCategoryButton}
            leftIcon={<AddIcon />}
          >
            Adicionar categoria
          </Button>
        </Flex>
        <HolidayCategoryAccordion
          loading={loadingCategories}
          categories={holidaysCategories}
          onHolidayCategoryUpdate={handleEditHolidayCategoryButton}
          onHolidayCategoryDelete={handleDeleteHolidayCategoryButton}
          onHolidayCreate={handleCreateHolidayButton}
          onHolidayUpdate={handleEditHolidayButton}
          onHolidayDelete={handleDeleteHolidayButton}
        />
        <Dialog
          title={`Deletar categoria ${selectedHolidayCategory?.name}`}
          warningText={
            'Essa mudança é irreversível e irá apagar todas os feriados dessa categoria, juntamente com as alocações desses dias!'
          }
          isOpen={isOpenDeleteHolidayCategoryDialog}
          onClose={() => {
            setSelectedHolidayCategory(undefined);
            onCloseDeleteHolidayCategoryDialog();
          }}
          onConfirm={() => {
            handleDeleteHolidayCategory();
            onCloseDeleteHolidayCategoryDialog();
          }}
        />
        <Dialog
          title={`Deletar o feriado ${datetimeToDate(
            selectedHoliday ? selectedHoliday.date : '',
          )}`}
          warningText={
            'Essa mudança é irreversível e irá permitir alocações nesse dia!'
          }
          isOpen={isOpenDeleteHolidayDialog}
          onClose={() => {
            setSelectedHoliday(undefined);
            onCloseDeleteHolidayDialog();
          }}
          onConfirm={() => {
            handleDeleteHoliday();
            setSelectedHoliday(undefined);
            onCloseDeleteHolidayDialog();
          }}
        />
        <HolidayCategoryModal
          isUpdate={isUpdateHolidayCategory}
          isOpen={isOpenHolidayCategoryModal}
          onClose={() => {
            setSelectedHolidayCategory(undefined);
            setIsUpdateHolidayCategory(false);
            onCloseHolidayCategoryModal();
          }}
          refetch={getHolidaysCategories}
          selectedHolidayCategory={selectedHolidayCategory}
        />
        <HolidayModal
          categories={holidaysCategories}
          category={selectedHolidayCategory}
          isUpdate={isUpdateHoliday}
          isOpen={isOpenHolidayModal}
          refetch={getHolidaysCategories}
          onClose={() => {
            setSelectedHoliday(undefined);
            setIsUpdateHoliday(false);
            onCloseHolidayModal();
          }}
          selectedHoliday={selectedHoliday}
        />
      </Flex>
    </>
  );
}

export default Holidays;
