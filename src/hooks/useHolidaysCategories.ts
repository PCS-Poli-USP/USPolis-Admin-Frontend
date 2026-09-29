import useCustomToast from '../hooks/useCustomToast';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from '../models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from '../models/http/responses/holidayCategory.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useHolidayCategoryService from './API/services/useHolidayCategoryService';
import HolidayCategoryErrorParser from './holidayCategoryErrorParser';

const useHolidaysCategories = (initialFetch = true) => {
  const service = useHolidayCategoryService();
  const [loading, setLoading] = useState(false);
  const [holidaysCategories, setHolidaysCategories] = useState<
    HolidayCategoryResponse[]
  >([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new HolidayCategoryErrorParser(), []);

  const getHolidaysCategories = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setHolidaysCategories(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const createHolidayCategory = useCallback(
    async (data: CreateHolidayCategory) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Categoria ${data.name} criada com sucesso!`,
            'success',
          );
          getHolidaysCategories();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast, service, parser],
  );

  const updateHolidayCategory = useCallback(
    async (id: number, data: UpdateHolidayCategory) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Categoria atualizada com sucesso!`, 'success');
          getHolidaysCategories();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast, service, parser],
  );

  const deleteHolidayCategory = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover categoria', 'success');

          getHolidaysCategories();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidaysCategories, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getHolidaysCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

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
