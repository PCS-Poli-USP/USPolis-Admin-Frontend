import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';
import useSchedules from 'hooks/useSchedules';
import { ClassFullResponse } from 'models/http/responses/class.response.models';
import { useEffect, useState } from 'react';
import { getScheduleFullString } from 'utils/schedules/schedule.formatter';

interface ScheduleAccordionProps {
  class?: ClassFullResponse;
}

export default function ScheduleAccordion(props: ScheduleAccordionProps) {
  const {
    selectedDays,
    highlightedDays,
    occupiedDays,
    setSelectedDays,
    dayClick,
  } = useDateCalendarPicker();

  const [oldDates, setOldDates] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const { loading, updateOccurrences } = useSchedules();

  useEffect(() => {
    if (props.class && props.class.schedules.length > 0) {
      const schedule = props.class.schedules[0];
      const dates = schedule.occurrences.map((occur) => occur.date);
      setSelectedDays(dates);
      setOldDates(dates);
      setSelectedId(schedule.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.class]);

  return (
    <Accordion
      allowToggle
      borderColor={'blackAlpha.900'}
      border={'1px'}
      defaultIndex={[0]}
    >
      {props.class ? (
        props.class.schedules.map((schedule, index) => (
          <AccordionItem key={index}>
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  onClick={() => {
                    if (!isExpanded) {
                      const dates = schedule.occurrences.map(
                        (occur) => occur.date,
                      );
                      setSelectedDays(dates);
                      setOldDates(dates);
                      setSelectedId(schedule.id);
                    } else {
                      setSelectedDays([]);
                      setOldDates([]);
                      setSelectedId(undefined);
                    }
                  }}
                >
                  <Box as='span' flex='1' textAlign='left'>
                    <Text as={'b'}>{getScheduleFullString(schedule)}</Text>
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize='12px' />
                  ) : (
                    <AddIcon fontSize='12px' />
                  )}
                </AccordionButton>

                <AccordionPanel>
                  <Divider mb={2} borderColor={'blackAlpha.500'} />
                  {schedule.occurrences.length === 0 ? (
                    <Alert status={'error'} fontSize={'sm'} mb={4}>
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
                      <Text fontSize={'sm'}>
                        Modifique as datas conforme desejar, lembre de salvar
                      </Text>
                      <HStack>
                        <Button
                          onClick={() => {
                            setSelectedDays(oldDates);
                          }}
                        >
                          Restaurar
                        </Button>
                        <Button
                          onClick={async () => {
                            if (selectedId) {
                              const newSchedule = await updateOccurrences(
                                selectedId,
                                {
                                  dates: selectedDays,
                                },
                              );
                              if (props.class && newSchedule) {
                                props.class.schedules[index] = newSchedule;
                              }
                            }
                          }}
                          colorScheme={'blue'}
                          disabled={loading}
                        >
                          Salvar
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))
      ) : (
        <Center h={'50px'}>
          <Spinner />
        </Center>
      )}
    </Accordion>
  );
}
