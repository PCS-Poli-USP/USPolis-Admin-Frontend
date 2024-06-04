import { Button, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import Navbar from 'components/common/NavBar/navbar.component';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useContext, useEffect, useState } from 'react';
import HolidaysCategoriesService from 'services/api/holidayCategory.service';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';
import HolidayModal from './HolidayModal/holiday.modal';
import HolidayCategoryModal from './HolidayCategoryModal';
import {
  CreateHoliday,
  CreateManyHolidays,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import HolidaysService from 'services/api/holiday.service';
import { appContext } from 'context/AppContext';
import useCustomToast from 'hooks/useCustomToast';
import { sortHolidaysCategoriesResponse } from 'utils/holidaysCategories/holidaysCategories.sorter';
import Dialog from 'components/common/Dialog/dialog.component';
import { datetimeToDate } from 'utils/formatters';
import HolidayCategoryAccordion from './HolidayCategoryAccordion/holidayCategory.accordion';
import { AddIcon } from '@chakra-ui/icons';

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

  const { setLoading } = useContext(appContext);
  const [holidaysCategories, setHolidaysCategories] = useState<
    HolidayCategoryResponse[]
  >([]);
  const [selectedHolidayCategory, setSelectedHolidayCategory] = useState<
    HolidayCategoryResponse | undefined
  >(undefined);
  const [selectedHoliday, setSelectedHoliday] = useState<
    HolidayUnfetchResponse | undefined
  >(undefined);
  const [isUpdateHolidayCategory, setIsUpdateHolidayCategory] = useState(false);
  const [isUpdateHoliday, setIsUpdateHoliday] = useState(false);

  const showToast = useCustomToast();
  const holidaysCategoriesService = new HolidaysCategoriesService();
  const holidaysService = new HolidaysService();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    await fetchHolidaysCategories();
  }

  async function fetchHolidaysCategories() {
    await holidaysCategoriesService
      .list()
      .then((response) => {
        setHolidaysCategories(
          response.data.sort(sortHolidaysCategoriesResponse),
        );
      })
      .catch((error) => {
        showToast('Erro', `Erro ao carregar categorias: ${error}`, 'error');
      })
      .finally();
  }

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

  async function createHolidayCategory(data: CreateHolidayCategory) {
    setLoading(true);
    await holidaysCategoriesService
      .create(data)
      .then((response) => {
        showToast(
          'Sucesso',
          `Categoria ${data.name} criada com sucesso!`,
          'success',
        );
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao criar categoria: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function updateHolidayCategory(
    id: number,
    data: UpdateHolidayCategory,
  ) {
    setLoading(true);
    await holidaysCategoriesService
      .update(id, data)
      .then(() => {
        showToast(
          'Sucesso!',
          `Categoria ${data.name} atualizada com sucesso`,
          'success',
        );
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao atualizar categoria: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function deleteHolidayCategory() {
    if (!selectedHolidayCategory) return;
    setLoading(true);
    await holidaysCategoriesService
      .delete(selectedHolidayCategory.id)
      .then((response) => {
        showToast('Sucesso', 'Categoria removida com sucesso', 'success');
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao apagar categoria: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
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

  async function createHoliday(data: CreateHoliday) {
    setLoading(true);
    await holidaysService
      .create(data)
      .then((response) => {
        showToast(
          'Sucesso',
          `Feriado do dia ${data.date} criado com sucesso!`,
          'success',
        );
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao criar feriado: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function createManyHolidays(data: CreateManyHolidays) {
    setLoading(true);
    await holidaysService
      .createMany(data)
      .then((response) => {
        showToast(
          'Sucesso',
          `${response.data.length} feriados criados com sucesso!`,
          'success',
        );
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao criar feriados: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function updateHoliday(id: number, data: UpdateHoliday) {
    setLoading(true);
    await holidaysService
      .update(id, data)
      .then((response) => {
        showToast('Sucesso', `Feriado atualizado com sucesso!`, 'success');
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast(
          'Erro',
          `Erro ao atualizar o feriado ${data.date}: ${error}`,
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function deleteHoliday() {
    if (!selectedHoliday) return;
    setLoading(true);
    await holidaysService
      .delete(selectedHoliday.id)
      .then((response) => {
        showToast('Sucesso', 'Feriado removido com sucesso', 'success');
        fetchHolidaysCategories();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao remover feriado: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
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
            deleteHolidayCategory();
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
            deleteHoliday();
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
          onCreate={createHolidayCategory}
          onUpdate={updateHolidayCategory}
          selectedHolidayCategory={selectedHolidayCategory}
        />
        <HolidayModal
          categories={holidaysCategories}
          category={selectedHolidayCategory}
          isUpdate={isUpdateHoliday}
          isOpen={isOpenHolidayModal}
          onClose={() => {
            setSelectedHoliday(undefined);
            setIsUpdateHoliday(false);
            onCloseHolidayModal();
          }}
          onCreate={createHoliday}
          onCreateMany={createManyHolidays}
          onUpdate={updateHoliday}
          selectedHoliday={selectedHoliday}
        />
      </Flex>
    </>
  );
}

export default Holidays;
