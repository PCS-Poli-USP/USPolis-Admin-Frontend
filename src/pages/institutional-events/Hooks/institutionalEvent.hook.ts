import useCustomToast from 'hooks/useCustomToast';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import { useCallback, useEffect, useState } from 'react';
import InstutionalEventsService from 'services/api/institutionalEvents.service';

const service = new InstutionalEventsService();

export const useEvents = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<InstitutionalEventResponse[]>([]);

  const showToast = useCustomToast();

  const getEvents = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar eventos institucionais', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const deleteEvent = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast(
            'Sucesso!',
            'Sucesso ao remover evento institucional',
            'success',
          );

          getEvents();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover evento institucional', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast],
  );

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return { loading, getEvents, events, deleteEvent };
};
