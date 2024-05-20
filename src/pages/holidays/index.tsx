import {
  Button,
  Checkbox,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from 'components/common/DataTable/dataTable.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useContext, useEffect, useState } from 'react';
import HolidaysCategoriesService from 'services/api/holidayCategory.service';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';
import HolidayModal from './HolidayModal/holiday.modal';
import HolidayCategoryModal from './HolidayCategoryModal';
import {
  CreateHoliday,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import HolidaysService from 'services/api/holiday.service';
import { appContext } from 'context/AppContext';
import useCustomToast from 'hooks/useCustomToast';
import { sortHolidaysCategoriesResponse } from 'utils/holidaysCategories/holidaysCategories.sorter';
import Dialog from 'components/common/Dialog/dialog.component';
import { sortHolidaysResponse } from 'utils/holidays/holidays.sorter';
import { datetimeToDate } from 'utils/formatters';
import { getHolidaysCategoryColumns } from './Tables/holidayCategory.table';
import { getHolidaysColumns } from './Tables/holiday.table';

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
  const [isShowingCategories, setIsShowingCategories] = useState(true);
  const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
  const [holidaysCategories, setHolidaysCategories] = useState<
    HolidayCategoryResponse[]
  >([]);
  const [selectedHolidayCategory, setSelectedHolidayCategory] = useState<
    HolidayCategoryResponse | undefined
  >(undefined);
  const [selectedHoliday, setSelectedHoliday] = useState<
    HolidayResponse | undefined
  >(undefined);
  const [isUpdateHolidayCategory, setIsUpdateHolidayCategory] = useState(false);
  const [isUpdateHoliday, setIsUpdateHoliday] = useState(false);

  const showToast = useCustomToast();
  const holidaysCategoriesService = new HolidaysCategoriesService();
  const holidaysService = new HolidaysService();

  const holidayCategoryColumns = getHolidaysCategoryColumns({
    handleEditButton: handleEditHolidayCategoryButton,
    handleDeleteButton: handleDeleteHolidayCategoryButton,
  });

  const holidaysColumns = getHolidaysColumns({
    handleEditButton: handleEditHolidayButton,
    handleDeleteButton: handleDeleteHolidayButton,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await fetchHolidays();
    await fetchHolidaysCategories();
  }

  async function fetchHolidays() {
    setLoading(true);
    await holidaysService
      .list()
      .then((response) => {
        setHolidays(response.data.sort(sortHolidaysResponse));
      })
      .catch((error) => {
        showToast('Erro', `Erro ao carregar feriados: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
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

  function handleCreateButton() {
    if (isShowingCategories) {
      onOpenHolidayCategoryModal();
    } else {
      onOpenHolidayModal();
    }
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
    id: string,
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

  function handleEditHolidayButton(data: HolidayResponse) {
    setSelectedHoliday(data);
    setIsUpdateHoliday(true);
    onOpenHolidayModal();
  }

  function handleDeleteHolidayButton(data: HolidayResponse) {
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
        fetchHolidays();
      })
      .catch((error) => {
        showToast('Erro', `Erro ao criar feriado: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function updateHoliday(id: string, data: UpdateHoliday) {
    setLoading(true);
    await holidaysService
      .update(id, data)
      .then((response) => {
        showToast('Sucesso', `Feriado atualizado com sucesso!`, 'success');
        fetchHolidays();
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
        fetchHolidays();
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
      <Flex paddingX={4} direction={'column'}>
        <Flex align={'center'}>
          <Text fontSize={'4xl'} mb={4}>
            {isShowingCategories ? 'Categorias de Feriados' : 'Feriados'}
          </Text>
          <Spacer />
          <Checkbox
            fontWeight={'bold'}
            mr={4}
            onChange={(event) => setIsShowingCategories(!event.target.checked)}
          >
            {isShowingCategories
              ? 'Trocar para feriados'
              : 'Trocar para categorias'}
          </Checkbox>
          <Button onClick={handleCreateButton}>
            {isShowingCategories ? 'Adicionar categoria' : 'Adicionar feriado'}
          </Button>
        </Flex>
        <DataTable
          hidden={!isShowingCategories}
          data={holidaysCategories}
          columns={holidayCategoryColumns}
        />
        <DataTable
          hidden={isShowingCategories}
          data={holidays}
          columns={holidaysColumns}
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
          )} da categoria ${selectedHoliday?.category}`}
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
          onClose={onCloseHolidayCategoryModal}
          onCreate={createHolidayCategory}
          onUpdate={updateHolidayCategory}
          selectedHolidayCategory={selectedHolidayCategory}
        />
        <HolidayModal
          isUpdate={isUpdateHoliday}
          categories={holidaysCategories}
          isOpen={isOpenHolidayModal}
          onClose={onCloseHolidayModal}
          onCreate={createHoliday}
          onUpdate={updateHoliday}
          selectedHoliday={selectedHoliday}
        />
      </Flex>
    </>
  );
}

export default Holidays;
