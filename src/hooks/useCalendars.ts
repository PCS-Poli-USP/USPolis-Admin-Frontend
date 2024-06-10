import useCustomToast from 'hooks/useCustomToast';
import { CreateCalendar, UpdateCalendar } from 'models/http/requests/calendar.request.models';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { useCallback, useEffect, useState } from 'react';
import CalendarsService from 'services/api/calendars.service';
import { sortCalendarResponse } from 'utils/calendars/calendar.sorter';

const service = new CalendarsService();

const useCalendars = () => {
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<BuildingResponse[]>([]);

  const showToast = useCustomToast();

  const getBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setCalendars(response.data.sort(sortCalendarResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar calendários', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const createCalendar = useCallback(
    async (data: CreateCalendar) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Calendário ${data.name} criado com sucesso!`,
            'success',
          );
          getBuildings();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar calendário: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast],
  );

  const updateCalendar = useCallback(async (id: number, data: UpdateCalendar) => {
    setLoading(true);
    await service
      .update(id, data)
      .then((response) => {
        showToast('Sucesso', `Calendário atualizado com sucesso!`, 'success');
        getBuildings();
      })
      .catch((error) => {
        showToast(
          'Erro',
          `Erro ao atualizar o calendário ${data.name}: ${error}`,
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getBuildings, showToast]);

  const deleteCalendar = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover calendário', 'success');

          getBuildings();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover calendário', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast],
  );

  useEffect(() => {
    getBuildings();
  }, [getBuildings]);

  return {
    loading,
    calendars,
    getBuildings,
    createCalendar,
    updateCalendar,
    deleteCalendar,
  };
};

export default useCalendars;
