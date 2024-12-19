import useCustomToast from 'hooks/useCustomToast';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortHolidaysCategoriesResponse } from 'utils/holidaysCategories/holidaysCategories.sorter';
import useHolidayCategoryService from './API/services/useHolidayCategoryService';

const useHolidaysCategories = () => {
  const service = useHolidayCategoryService();
  const [loading, setLoading] = useState(false);
  const [holidaysCategories, setHolidaysCategories] = useState<
    HolidayCategoryResponse[]
  >([]);

  const showToast = useCustomToast();

  const getHolidaysCategories = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setHolidaysCategories(
          response.data.sort(sortHolidaysCategoriesResponse),
        );
      })
      .catch((error) => {
        console.log(error);
        showToast('Erro', `Erro ao carregar categorias: ${error}`, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

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
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast, service],
  );

  const updateHolidayCategory = useCallback(
    async (id: number, data: UpdateHolidayCategory) => {
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
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast, service],
  );

  const deleteHolidayCategory = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
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
    [getHolidaysCategories, showToast, service],
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
