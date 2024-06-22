import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useState } from 'react';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import Dialog from 'components/common/Dialog/dialog.component';
import { datetimeToDate } from 'utils/formatters';
import useHolidaysCategories from 'hooks/useHolidaysCategories';
import useHolidays from 'hooks/useHolidays';
import HolidayCategoryAccordion from 'pages/calendars/HolidayCategoryAccordion';
import HolidayCategoryModal from 'pages/calendars/HolidayCategoryModal';
import HolidayModal from 'pages/calendars/HolidayModal';
import { HolidaysContentModalProps } from './holidaysContent.modal.interface';
import { AddIcon } from '@chakra-ui/icons';

function HolidaysContentModal(props: HolidaysContentModalProps) {
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

  const { deleteHolidayCategory } = useHolidaysCategories();

  const { deleteHoliday, loading: loadingHolidays } = useHolidays();

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

  async function handleDeleteHolidayCategory() {
    if (!selectedHolidayCategory) return;
    await deleteHolidayCategory(selectedHolidayCategory.id);
    props.refetch();
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

  async function handleDeleteHoliday() {
    if (!selectedHoliday) return;
    await deleteHoliday(selectedHoliday.id);
    props.refetch();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={'5xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Feriados e Categorias de Feriados</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack w={'full'} align={'stretch'} spacing={4}>
            <HStack>
              <Spacer />
              <Button
                onClick={handleCreateHolidayCategoryButton}
                leftIcon={<AddIcon />}
              >
                Adicionar categoria
              </Button>
            </HStack>

            <HolidayCategoryAccordion
              loading={props.isLoading || loadingHolidays}
              categories={props.categories}
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
              refetch={props.refetch}
              selectedHolidayCategory={selectedHolidayCategory}
            />
            <HolidayModal
              categories={props.categories}
              category={selectedHolidayCategory}
              isUpdate={isUpdateHoliday}
              isOpen={isOpenHolidayModal}
              refetch={props.refetch}
              onClose={() => {
                setSelectedHoliday(undefined);
                setIsUpdateHoliday(false);
                onCloseHolidayModal();
              }}
              selectedHoliday={selectedHoliday}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={props.onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default HolidaysContentModal;
