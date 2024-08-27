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
import { useState } from 'react';
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
  const { updateOccurrences } = useSchedules();

  return (
    <Accordion borderColor={'blackAlpha.900'} allowToggle>
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
        <Spinner />
      )}
    </Accordion>
  );
}
