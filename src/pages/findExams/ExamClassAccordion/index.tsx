import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { ExamResponse } from '../../../models/http/responses/exam.response.models';
import moment from 'moment';

interface ExamClassAccordionProps {
  exams: ExamResponse[];
  loading: boolean;
}

function ExamClassAccordion({ exams }: ExamClassAccordionProps) {
  return (
    <>
      {exams.length > 0 && (
        <Accordion allowToggle border={'1px'} borderColor={'uspolis.blue'}>
          {exams.map((examData, index) => {
            const schedule = examData.reservation.schedule;
            const occurrences = examData.reservation.schedule.occurrences;
            return (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box
                      as='span'
                      flex='1'
                      textAlign='left'
                      fontWeight={'bold'}
                    >
                      {examData.classes.length > 0
                        ? `Turmas: ${examData.classes.map((cls) => classNumberFromClassCode(cls.code)).join(', ')}`
                        : 'Provas gerais da disciplina'}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Flex direction={'column'} gap={'5px'}>
                    {occurrences &&
                      occurrences.map((occur, idx) => (
                        <Box key={`occ-${idx}`} mb={'5px'}>
                          <Text>
                            <b>{`${occur.label ? occur.label : 'Sem rótulo'}:`}</b>
                          </Text>
                          <Text>{`Sala: ${schedule.classroom ? schedule.classroom : 'Sem local definido'}`}</Text>
                          <Text>
                            {`Dia ${moment(occur.date).format('DD/MM/YYYY')}, das ${moment(occur.start_time, 'HH:mm').format('HH:mm')} até ${moment(occur.end_time, 'HH:mm').format('HH:mm')}`}
                          </Text>
                        </Box>
                      ))}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      {exams.length === 0 && (
        <Alert
          status='warning'
          borderRadius={'10px'}
          mt={'40px'}
          textAlign={'center'} 
          fontSize={'xl'}
          justifyContent={'center'}
        >
          <AlertIcon />
          Nenhuma prova encontrada para essa disciplina
        </Alert>
      )}
    </>
  );
}

export default ExamClassAccordion;
