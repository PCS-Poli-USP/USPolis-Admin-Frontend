import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Divider,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import DateCalendarPicker, {
  useDateCalendarPicker,
} from '../../../components/common/DateCalendarPicker';

import { ReservationFullResponse } from '../../../models/http/responses/reservation.response.models';
import { ScheduleFullResponse } from '../../../models/http/responses/schedule.response.models';

import { getScheduleFullString } from '../../../utils/schedules/schedule.formatter';
import useReservationOccurrences from '../../../hooks/useReservationOccurrences';

interface ReservationScheduleAccordionProps {
  reservation?: ReservationFullResponse;
  onSave?: () => void;
}

export default function ReservationScheduleAccordion({
  reservation,
  onSave,
}: ReservationScheduleAccordionProps) {
  const {
    selectedDays,
    highlightedDays,
    occupiedDays,
    setSelectedDays,
    dayClick,
  } = useDateCalendarPicker();

  const [schedule, setSchedule] = useState<ScheduleFullResponse>();
  const [oldDates, setOldDates] = useState<string[]>([]);

  const { loading, updateOccurrences } = useReservationOccurrences();
  const [reservationId, setReservationId] = useState<number>();

  useEffect(() => {
    if (!reservation) return;

    setReservationId(reservation.id);
    setSchedule(reservation.schedule);

    const dates = reservation.schedule.occurrences.map(occurrence => occurrence.date);

    setSelectedDays(dates);
    setOldDates(dates);
  }, [reservation, setSelectedDays]);

  if (!schedule) {
    return (
      <Center h="50px">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        {getScheduleFullString(schedule)}
      </Text>

      <Divider mb={3} />

      {schedule.occurrences.length === 0 ? (
        <Alert status="error">
          <AlertIcon />
          Agenda não alocada, aloque primeiro
        </Alert>
      ) : (
        <VStack>
          <DateCalendarPicker
            selectedDays={selectedDays}
            highlightedDays={highlightedDays}
            occupiedDays={occupiedDays}
            dayClick={dayClick}
            helpText
          />

          <Text fontSize="sm">
            Modifique as datas conforme desejar, lembre de salvar
          </Text>

          <HStack>
            <Button onClick={() => setSelectedDays(oldDates)}>
              Restaurar
            </Button>

            <Button
              colorScheme="blue"
              isLoading={loading}
              onClick={async () => {
                if (!reservationId) return;
                const updated = await updateOccurrences(reservationId, {
                  dates: selectedDays,
                });

                if (updated) {
                  setSchedule(updated.schedule);
                  setOldDates(selectedDays);
                  onSave?.();
                }
              }}
            >
              Salvar
            </Button>
          </HStack>
        </VStack>
      )}
    </>
  );
}