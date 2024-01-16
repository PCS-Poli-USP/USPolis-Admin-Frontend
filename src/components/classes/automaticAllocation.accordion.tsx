import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from '@chakra-ui/react';

import Class from 'models/class.model';
import Classroom from 'models/classroom.model';

import { useEffect, useState } from 'react';
import ClassroomsService from 'services/classrooms.service';

interface AutomaticAllocationAccordionProps {
  allocated: Class[];
  unallocated: Class[];
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

  function sortByClassCode(a: Class, b: Class) {
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
            <Text key={index}>{`${value.subject_code} - ${value.class_code} com ${value.vacancies} vagas, alocada em ${value.classrooms ? value.classrooms[0] : 'Erro'}`}</Text>
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
            <Text key={index}>{`${value.subject_code} - ${value.class_code} com ${value.vacancies} vagas`}</Text>
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
            <Text key={index}>{`${value.classroom_name} - ${value.capacity} de capacidade`}</Text>
          ))}
        </AccordionPanel>
      </AccordionItem>

    </Accordion>
  );
}
