import useCustomToast from '../hooks/useCustomToast';
import {
  CreateInstitutionalEvent,
  UpdateInstitutionalEvent,
} from '../models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventResponse } from '../models/http/responses/instituionalEvent.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useInstitutionalEventsService from './API/services/useInstitutionalEventsService';
import InstitutionalEventErrorParser from './institutionalEventErrorParser';

const useInstitutionalEvents = () => {
  const service = useInstitutionalEventsService();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<InstitutionalEventResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new InstitutionalEventErrorParser(), []);

  const getEvents = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const createEvent = useCallback(
    async (data: CreateInstitutionalEvent) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Evento institucional criado com sucesso!`,
            'success',
          );
          getEvents();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast, service, parser],
  );

  const updateEvent = useCallback(
    async (id: number, data: UpdateInstitutionalEvent) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast(
            'Sucesso',
            `Evento institucional atualizado com sucesso!`,
            'success',
          );
          getEvents();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast, service, parser],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast(
            'Sucesso!',
            'Sucesso ao remover evento institucional',
            'success',
          );

          getEvents();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getEvents, showToast, service, parser],
  );

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, events, getEvents, createEvent, updateEvent, deleteEvent };
};

export default useInstitutionalEvents;
