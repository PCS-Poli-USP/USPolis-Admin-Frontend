import useCustomToast from 'hooks/useCustomToast';
import {
  CreateInstitutionalEvent,
  UpdateInstitutionalEvent,
} from 'models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import { useCallback, useEffect, useState } from 'react';
import useInstitutionalEventsService from './API/services/useInstitutionalEventsService';

const useInstitutionalEvents = () => {
  const service = useInstitutionalEventsService();
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
  }, [showToast, service]);

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
    [getEvents, showToast, service],
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
    [getEvents, showToast, service],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
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
    [getEvents, showToast, service],
  );

  useEffect(() => {
    getEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, events, getEvents, createEvent, updateEvent, deleteEvent };
};

export default useInstitutionalEvents;
