import useCustomToast from '../hooks/useCustomToast';
import {
  CreateHoliday,
  CreateManyHolidays,
  UpdateHoliday,
} from '../models/http/requests/holiday.request.models';
import { HolidayResponse } from '../models/http/responses/holiday.response.models';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sortHolidaysResponse } from '../utils/holidays/holidays.sorter';
import useHolidaysService from './API/services/useHolidayService';
import HolidayErrorParser from './holidayErrorParser';

const useHolidays = (initialFetch = true) => {
  const service = useHolidaysService();
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<HolidayResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new HolidayErrorParser(), []);

  const getHolidays = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setHolidays(response.data.sort(sortHolidaysResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

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
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast, service, parser],
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
          showToast('Erro', parser.parseCreateManyError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast, service, parser],
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
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast, service, parser],
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
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getHolidays, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getHolidays();
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
