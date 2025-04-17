import useCustomToast from '../hooks/useCustomToast';
import {
  CreateHoliday,
  CreateManyHolidays,
  UpdateHoliday,
} from '../models/http/requests/holiday.request.models';
import { HolidayResponse } from '../models/http/responses/holiday.response.models';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { sortHolidaysResponse } from '../utils/holidays/holidays.sorter';
import useHolidaysService from './API/services/useHolidayService';

const useHolidays = (initialFetch = true) => {
  const service = useHolidaysService();
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
      .catch(() => {
        showToast('Erro', 'Erro ao carregar feriados', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createHoliday = useCallback(
    async (data: CreateHoliday) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Feriado do dia ${moment(data.date).format(
              'DD/MM/YYYY',
            )} criado com sucesso!`,
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
    [getHolidays, showToast, service],
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
    [getHolidays, showToast, service],
  );

  const updateHoliday = useCallback(
    async (id: number, data: UpdateHoliday) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
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
    },
    [getHolidays, showToast, service],
  );

  const deleteHoliday = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
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
    [getHolidays, showToast, service],
  );

  useEffect(() => {
    if (initialFetch)
    getHolidays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

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
