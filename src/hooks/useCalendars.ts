import useCustomToast from '../hooks/useCustomToast';
import {
  CreateCalendar,
  UpdateCalendar,
} from '../models/http/requests/calendar.request.models';
import { CalendarResponse } from '../models/http/responses/calendar.responde.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useCalendarsService from './API/services/useCalendarsService';
import CalendarErrorParser from './calendarErrorParser';

const useCalendars = (initialFetch = true, initialYear?: string) => {
  const service = useCalendarsService();
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<CalendarResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new CalendarErrorParser(), []);

  const getCalendars = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setCalendars(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const getCalendarsByYear = useCallback(
    async (year?: string) => {
      setLoading(true);
      await service
        .listByYear(year)
        .then((response) => {
          setCalendars(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  const createCalendar = useCallback(
    async (data: CreateCalendar) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Calendário ${data.name} criado com sucesso!`,
            'success',
          );
          getCalendars();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCalendars, showToast, service, parser],
  );

  const updateCalendar = useCallback(
    async (id: number, data: UpdateCalendar) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Calendário atualizado com sucesso!`, 'success');
          getCalendars();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCalendars, showToast, service, parser],
  );

  const deleteCalendar = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover calendário', 'success');

          getCalendars();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCalendars, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) {
      if (initialYear) {
        getCalendarsByYear(initialYear);
        return;
      }
      getCalendars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch, initialYear]);
  return {
    loading,
    calendars,
    getCalendars,
    getCalendarsByYear,
    createCalendar,
    updateCalendar,
    deleteCalendar,
  };
};

export default useCalendars;
