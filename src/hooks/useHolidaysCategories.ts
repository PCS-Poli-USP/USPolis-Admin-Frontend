import useCustomToast from 'hooks/useCustomToast';
import { CreateHolidayCategory, UpdateHolidayCategory } from 'models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useCallback, useEffect, useState } from 'react';
import HolidaysCategoriesService from 'services/api/holidayCategory.service';
import { sortHolidaysCategoriesResponse } from 'utils/holidaysCategories/holidaysCategories.sorter';

const service = new HolidaysCategoriesService();

const useHolidaysCategories = () => {
  const [loading, setLoading] = useState(false);
  const [holidaysCategories, setHolidaysCategories] = useState<HolidayCategoryResponse[]>([]);

  const showToast = useCustomToast();

  const getHolidaysCategories = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setHolidaysCategories(response.data.sort(sortHolidaysCategoriesResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar categorias', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const createHolidayCategory = useCallback(
    async (data: CreateHolidayCategory) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Categoria ${data.name} criada com sucesso!`,
            'success',
          );
          getHolidaysCategories();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar categoria: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast],
  );


  const updateHolidayCategory = useCallback(async (id: number, data: UpdateHolidayCategory) => {
    setLoading(true);
    await service
      .update(id, data)
      .then((response) => {
        showToast('Sucesso', `Categoria atualizada com sucesso!`, 'success');
        getHolidaysCategories();
      })
      .catch((error) => {
        showToast(
          'Erro',
          `Erro ao atualizar categoria ${data.name}: ${error}`,
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getHolidaysCategories, showToast]);

  const deleteHolidayCategory = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover categoria', 'success');

          getHolidaysCategories();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover categoria', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast],
  );

  useEffect(() => {
    getHolidaysCategories();
  }, [getHolidaysCategories]);

  return {
    loading,
    holidaysCategories,
    getHolidaysCategories,
    createHolidayCategory,
    updateHolidayCategory,
    deleteHolidayCategory,
  };
};

export default useHolidaysCategories;