import useCustomToast from 'hooks/useCustomToast';
import { ClassFullResponse } from 'models/http/responses/class.response.models';
import { ReservationFullResponse } from 'models/http/responses/reservation.response.models';
import {
  AllocationResourcesFromClasses,
  AllocationResourcesFromReservations,
  EventsFromClasses,
  EventsFromReservations,
} from 'pages/allocation/utils/allocation.utils';
import { useCallback, useEffect, useState } from 'react';
import ClassesService from 'services/api/classes.service';
import ReservationsService from 'services/api/reservations.service';
import { sortClassResponse } from 'utils/classes/classes.sorter';
import { sortReservationsResponse } from 'utils/reservations/reservations.sorter';
import { Resource, Event } from '../interfaces/allocation.interfaces';

const classService = new ClassesService();
const reservationService = new ReservationsService();

const useAllocation = () => {
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loagindResources, setLoadingResources] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<
    ClassFullResponse[]
  >([]);
  const [reservations, setReservations] = useState<
    ReservationFullResponse[]
  >([]);
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

  useEffect(() => {
    getAllocation();
  }, [getAllocation]);

  return {
    loading,
    loadingClasses,
    loadingReservations,
    loadingEvents,
    loagindResources,
    classes,
    reservations,
    events,
    resources,
    getClassesFull,
    getReservationsFull,
    getEvents,
    getResources,
    getAllocation,
  };
};

export default useAllocation;
