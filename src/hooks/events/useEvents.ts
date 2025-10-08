/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';

import useCustomToast from '../useCustomToast';
import {
  CreateEvent,
  UpdateEvent,
} from '../../models/http/requests/event.request.models';
import useEventsService from '../API/services/useEventsService';
import { EventResponse } from '../../models/http/responses/event.response.models';
import EventErrorParser from './eventErrorParser';

const useEvents = () => {
  const service = useEventsService();
  const [events, setEvents] = useState<Array<EventResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new EventErrorParser();
  const showToast = useCustomToast();

  const getEvents = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    await service
      .get(start, end)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const createEvent = useCallback(async (data: CreateEvent) => {
    setLoading(true);
    await service
      .create(data)
      .then((response) => {
        showToast('Sucesso', 'Evento criado com sucesso', 'success');
        return response.data;
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseCreateError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateEvent = useCallback(
    async (event_id: number, data: UpdateEvent) => {
      setLoading(true);
      await service
        .update(event_id, data)
        .then((response) => {
          showToast('Sucesso', 'Evento atualizado com sucesso', 'success');
          return response.data;
        })
        .catch((error) => {
          showToast('Erro', errorParser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  return {
    events,
    loading,
    getEvents,
    createEvent,
    updateEvent,
  };
};

export default useEvents;
