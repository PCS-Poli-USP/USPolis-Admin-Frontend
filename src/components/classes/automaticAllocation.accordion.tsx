import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { BsBookHalf, BsHouseFill } from "react-icons/bs";

import Classroom from 'models/classroom.model';
import Event from 'models/event.model';

import { useEffect, useState } from 'react';
import { weekDaysFormatter } from 'utils/classes/classes.formatter';
import ClassroomsService from 'services/classrooms.service';


interface AutomaticAllocationAccordionProps {
  allocated: Event[];
  unallocated: Event[];
}

export default function AutomaticAllocationAccordion({
  allocated,
  unallocated,
}: AutomaticAllocationAccordionProps) {

  const classroomService = new ClassroomsService();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    if (classrooms.length <= 0) fetchClassrooms();
    // eslint-disable-next-line
  }, []);

  function fetchClassrooms() {
    classroomService.list().then((it) => {
      it.data.sort((a, b) => {
        if (a.classroom_name < b.classroom_name) return -1;
        if (a.classroom_name > b.classroom_name) return 1;
        return 0;
      });
      setClassrooms(it.data);
    });
  }

  function sortByClassCode(a: Event, b: Event) {
    if (a.subject_code < b.subject_code) return -1;
    if (a.subject_code > b.subject_code) return 1;
    return 0;
  }

  allocated.sort(sortByClassCode)
  unallocated.sort(sortByClassCode);

  return (
    <Accordion defaultIndex={unallocated && unallocated.length > 0 ? [1] : [0]} allowMultiple={true} allowToggle={true}>
      <AccordionItem>
        <AccordionButton bg={'uspolis.blue'} color={'blackAlpha.900'} fontWeight={'bold'}>
          <Box as='span' flex='1' textAlign='left'>
            Turmas Alocadas
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {allocated.map((value, index) => (
            <HStack spacing={3}>
              <BsBookHalf />
              <Text>{`${value.subject_code} - ${value.class_code}, ${value.vacancies} vagas`}</Text>
              <CalendarIcon />
              <Text>{`${weekDaysFormatter(value.week_day)}, ${value.start_time} às ${value.end_time}`}</Text>
              <BsHouseFill />
              <Text>{`${value.classroom}`}</Text>
            </HStack>
          ))}
        </AccordionPanel>
      </AccordionItem>

      {unallocated.length > 0 ? (
        <AccordionItem>
          <AccordionButton bg={'red.500'} color={'black'} fontWeight={'bold'}>
            <Box as='span' flex='1' textAlign='left'>
            Turmas Não Alocadas
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
          {unallocated.map((value, index) => (
            <HStack spacing={3}>
              <BsBookHalf />
              <Text>{`${value.subject_code} - ${value.class_code}, ${value.vacancies} vagas`}</Text>
              <CalendarIcon />
              <Text>{`${weekDaysFormatter(value.week_day)}, ${value.start_time} às ${value.end_time}`}</Text>
            </HStack>
          ))}
          </AccordionPanel>
        </AccordionItem>
      ) : undefined}

      <AccordionItem>
        <AccordionButton bg={'uspolis.blue'} color={'blackAlpha.900'} fontWeight={'bold'}>
          <Box as='span' flex='1' textAlign='left'>
            Salas cadastradas
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {classrooms.map((value, index) => (
            <HStack>
              <BsHouseFill />
              <Text key={index}>{`${value.classroom_name} - ${value.capacity} de capacidade`}</Text>
            </HStack>
          ))}
        </AccordionPanel>
      </AccordionItem>

    </Accordion>
  );
}
