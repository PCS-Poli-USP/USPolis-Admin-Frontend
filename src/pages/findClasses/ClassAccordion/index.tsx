import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';

interface ClassAccordionProps {
  classes: ClassResponse[];
  loading: boolean;
}

function ClassAccordion({ classes }: ClassAccordionProps) {
  function scheduleToString(data: ScheduleResponse) {
    return `${Recurrence.translate(data.recurrence)} às ${
      data.week_day !== undefined
        ? WeekDay.translate(data.week_day) + "'s"
        : 'Sem dia da semana'
    }, ${data.start_time.slice(
      0,
      data.start_time.length - 3,
    )} às ${data.end_time.slice(0, data.end_time.length - 3)} `;
  }

  return (
    <Accordion allowToggle>
      {classes.map((classData, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left' fontWeight={'bold'}>
                {`Turma ${classData.code.slice(-2)}`}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex direction={'column'}>
              <Text fontWeight={'bold'}>Horários: </Text>
              {classData.schedules.map((schedule, index) => (
                <Box key={`B-${index}}`}>
                  <Text>{scheduleToString(schedule)}</Text>
                  <Text fontWeight={'bold'}>{`Prédio: ${
                    schedule.building || AllocationEnum.UNALLOCATED
                  } - Sala: ${
                    schedule.classroom || AllocationEnum.UNALLOCATED
                  }`}</Text>
                  <br></br>
                </Box>
              ))}
              <Text fontWeight={'bold'}>Professores: </Text>
              {classData.professors.map((professor, index) => (
                <Text key={`C-${index}}`}>{professor}</Text>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default ClassAccordion;
