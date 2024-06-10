import useCustomToast from 'hooks/useCustomToast';
import {
  CreateInstitutionalEvent,
  UpdateInstitutionalEvent,
} from 'models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import { useCallback, useEffect, useState } from 'react';
import InstutionalEventsService from 'services/api/institutionalEvents.service';

const service = new InstutionalEventsService();

const useInstitutionalEvents = () => {
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

  const createEvent = useCallback(
    async (data: CreateInstitutionalEvent) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Evento institucional criado com sucesso!`,
            'success',
          );
          getEvents();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao criar o evento ${data.title}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast],
  );

  const updateEvent = useCallback(
    async (id: number, data: UpdateInstitutionalEvent) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Evento institucional atualizado com sucesso!`,
            'success',
          );
          getEvents();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar o evento institucional ${data.title}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast],
  );

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

  return { loading, events, getEvents, createEvent, updateEvent, deleteEvent };
};

export default useInstitutionalEvents;
