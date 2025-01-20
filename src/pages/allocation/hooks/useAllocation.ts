import useCustomToast from 'hooks/useCustomToast';
import { useCallback, useEffect, useState } from 'react';
import { Resource, Event } from '../interfaces/allocation.interfaces';
import useALlocationsService from 'hooks/API/services/useAllocationService';

const useAllocation = () => {
  const allocationService = useALlocationsService();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const showToast = useCustomToast();

  const getEvents = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    let allEvents: Event[] = [];
    try {
      const response = await allocationService.listEvents(start, end);
      allEvents = response.data;
      setEvents(allEvents);
    } catch (error) {
      showToast('Erro', 'Erro ao carregar eventos', 'error');
      console.log(error);
      allEvents = [];
    } finally {
      setLoading(false);
    }
    return allEvents;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResources = useCallback(async () => {
    setLoading(true);
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
        // setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllocation = useCallback(async (start?: string, end?: string) => {
    await getResources();
    await getEvents(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    events,
    resources,
    getEvents,
    getAllocation,
  };
};

export default useAllocation;
