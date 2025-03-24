import useCustomToast from 'hooks/useCustomToast';
import { useCallback, useEffect, useState } from 'react';
import { Resource, Event } from '../interfaces/allocation.interfaces';
import useALlocationsService from 'hooks/API/services/useAllocationService';
import { EventUpdate } from 'models/http/requests/allocation.request.models';

const useAllocation = (
  initialFetchEvents: boolean = true,
  initialFetchResources = true,
  initialStart: string | undefined = undefined,
  initialEnd: string | undefined = undefined,
) => {
  const allocationService = useALlocationsService();
  const [loading, setLoading] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const showToast = useCustomToast();

  const getEvents = useCallback(async (start?: string, end?: string) => {
    setLoadingE(true);
    try {
      const response = await allocationService.listEvents(start, end);
      setEvents(response.data);
    } catch (error) {
      showToast('Erro', 'Erro ao carregar eventos', 'error');
      console.log(error);
      setEvents([]);
    } finally {
      setLoadingE(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResources = useCallback(async () => {
    setLoadingR(true);
    await allocationService
      .listResources()
      .then((response) => {
        const data = response.data;
        setResources(data);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar recursos', 'error');
        console.log(error);
        setResources([]);
      })
      .finally(() => {
        setLoadingR(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllocation = useCallback(async (start?: string, end?: string) => {
    await getEvents(start, end);
    await getResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateEvent = useCallback(async (input: EventUpdate) => {
    setLoading(true);
    await allocationService
      .update(input)
      .then(() => {
        showToast('Sucesso', 'Evento atualizado com sucesso', 'success');
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao atualizar evento', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFetchEvents) getEvents(initialStart, initialEnd);
    if (initialFetchResources) getResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    loadingE,
    loadingR,
    events,
    resources,
    getEvents,
    getResources,
    getAllocation,
    updateEvent,
  };
};

export default useAllocation;
