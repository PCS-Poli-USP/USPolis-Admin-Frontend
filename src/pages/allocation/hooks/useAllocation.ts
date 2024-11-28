import useCustomToast from 'hooks/useCustomToast';
import { useCallback, useEffect, useState } from 'react';
import AllocationService from 'services/api/allocations.service';
import { Resource, Event } from '../interfaces/allocation.interfaces';

const allocationService = new AllocationService();

const useAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const showToast = useCustomToast();

  const getEvents = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    let allEvents: Event[] = [];
    try {
      const response = await allocationService.list(start, end);
      allEvents = response.data;
      setEvents(allEvents);
      getResources(allEvents);
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

  const getResources = (events: Event[]) => {
    const buildingResources: Resource[] = [];
    const classroomResources: Resource[] = [];
    events.forEach((event) => {
      const data = event.resourceId.split('-');
      buildingResources.push({ id: data[0], title: data[0] });
      classroomResources.push({
        id: event.resourceId,
        title: data[1],
        parentId: data[0],
      });
    });
    const uniqueBuildingResources = Array.from(
      new Map(buildingResources.map((obj) => [obj.id, obj])).values(),
    );
    const uniqueClassroomResources = Array.from(
      new Map(classroomResources.map((obj) => [obj.id, obj])).values(),
    );
    const resources = Array.from(
      new Set([...uniqueBuildingResources, ...uniqueClassroomResources]),
    );
    setResources(resources);
  };

  const getAllocation = useCallback(async (start?: string, end?: string) => {
    await getEvents(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEvents();
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
