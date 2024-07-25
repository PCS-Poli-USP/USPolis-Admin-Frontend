import useCustomToast from 'hooks/useCustomToast';
import { ClassWithOccurrencesResponse } from 'models/http/responses/class.response.models';
import { ReservationWithOccurrencesResponse } from 'models/http/responses/reservation.response.models';
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
  const [classesWithOccurrences, setClassesWithOccurrences] = useState<
    ClassWithOccurrencesResponse[]
  >([]);
  const [reservationsWithOccurrences, setReserationWithOccurrences] = useState<
    ReservationWithOccurrencesResponse[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const showToast = useCustomToast();

  const getClassesWithOccurrences = useCallback(async () => {
    setLoadingClasses(true);
    let classes: ClassWithOccurrencesResponse[] = [];
    await classService
      .listWithOccurrences()
      .then((response) => {
        classes = response.data.sort(sortClassResponse);
        setClassesWithOccurrences(classes);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar turmas com ocorrências', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoadingClasses(false);
      });
    return classes;
  }, [showToast]);

  const getReservationsWithOccurrences = useCallback(async () => {
    setLoadingReservations(true);
    let reservations: ReservationWithOccurrencesResponse[] = [];
    await reservationService
      .listWithOccurrences()
      .then((response) => {
        reservations = response.data.sort(sortReservationsResponse);
        setReserationWithOccurrences(reservations);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar reservas com ocorrências', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoadingReservations(false);
      });
    return reservations;
  }, [showToast]);

  const getEvents = useCallback(async () => {
    setLoadingEvents(true);
    const classes = await getClassesWithOccurrences();
    const reservations = await getReservationsWithOccurrences();
    const classEvents = EventsFromClasses(classes);
    const reservationEvents = EventsFromReservations(reservations);
    const allEvents = [...classEvents, ...reservationEvents];
    setEvents(allEvents);
    setLoadingEvents(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResources = useCallback(async () => {
    setLoadingResources(true);
    const classResources = AllocationResourcesFromClasses(
      classesWithOccurrences,
    );
    const reservationResources = AllocationResourcesFromReservations(
      reservationsWithOccurrences,
    );
    setResources(
      Array.from(new Set([...classResources, ...reservationResources])),
    );
    setLoadingResources(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllocation = useCallback(async () => {
    setLoading(true);
    const classes = await getClassesWithOccurrences();
    const reservations = await getReservationsWithOccurrences();

    const classEvents = EventsFromClasses(classes);
    const reservationEvents = EventsFromReservations(reservations);
    setEvents([...classEvents, ...reservationEvents]);

    const classResources = AllocationResourcesFromClasses(classes);
    const reservationsResources =
      AllocationResourcesFromReservations(reservations);
    setResources(
      Array.from(new Set([...classResources, ...reservationsResources])),
    );
    setLoading(false);
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
    classesWithOccurrences,
    reservationsWithOccurrences,
    events,
    resources,
    getClassesWithOccurrences,
    getReservationsWithOccurrences,
    getEvents,
    getResources,
    getAllocation,
  };
};

export default useAllocation;
