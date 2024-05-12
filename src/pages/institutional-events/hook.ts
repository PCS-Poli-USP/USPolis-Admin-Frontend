import { useToast } from '@chakra-ui/react';
import { InstitutionalEvent } from 'models/database/institutionalEvent.model';
import { useCallback, useEffect, useState } from 'react';
import InstutionalEventsService from 'services/institutional-events.service';

const service = new InstutionalEventsService();

export const useEvents = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<InstitutionalEvent[]>([]);

  const toast = useToast();

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await service.list();

      setEvents(data);
    } catch {
      toast({
        description: 'Houve um erro ao buscar os eventos.',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        await service.delete(id);

        toast({
          description: 'Evento removido com sucesso!',
          status: 'success',
          isClosable: true,
          position: 'top-right',
        });

        getEvents();
      } catch {
        toast({
          description: 'Houve um erro ao remover o evento.',
          status: 'error',
          isClosable: true,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    },
    [getEvents, toast],
  );

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return { loading, getEvents, events, deleteEvent };
};
