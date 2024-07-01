import useCustomToast from 'hooks/useCustomToast';
import {
  CreateHoliday,
  CreateManyHolidays,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import { useCallback, useEffect, useState } from 'react';
import HolidaysService from 'services/api/holiday.service';
import { sortHolidaysResponse } from 'utils/holidays/holidays.sorter';

const service = new HolidaysService();

const useHolidays = () => {
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<HolidayResponse[]>([]);

  const showToast = useCustomToast();

  const getHolidays = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setHolidays(response.data.sort(sortHolidaysResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar feriados', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const createHoliday = useCallback(
    async (data: CreateHoliday) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Feriado do dia ${data.date} criado com sucesso!`,
            'success',
          );
          getHolidays();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar feriado: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast],
  );

  const createManyHolidays = useCallback(
    async (data: CreateManyHolidays) => {
      setLoading(true);
      await service
        .createMany(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `${response.data.length} feriados criados com sucesso!`,
            'success',
          );
          getHolidays();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar feriados: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast],
  );

  const updateHoliday = useCallback(async (id: number, data: UpdateHoliday) => {
    setLoading(true);
    await service
      .update(id, data)
      .then((response) => {
        showToast('Sucesso', `Feriado atualizado com sucesso!`, 'success');
        getHolidays();
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
  }, [getHolidays, showToast]);

  const deleteHoliday = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover feriado', 'success');
          getHolidays();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover feriado', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast],
  );

  useEffect(() => {
    getHolidays();
  }, [getHolidays]);

  return {
    loading,
    holidays,
    getHolidays,
    createHoliday,
    createManyHolidays,
    updateHoliday,
    deleteHoliday,
  };
};

export default useHolidays;
