import { Badge, Flex, Spacer, Text, useMediaQuery } from '@chakra-ui/react';
import moment from 'moment';
import { MdOutlineRoom } from 'react-icons/md';
import { LuCalendarDays } from 'react-icons/lu';
import { ExamResponse } from '../../../models/http/responses/exam.response.models';
import { PiStudent } from 'react-icons/pi';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';

interface ExamCardProps {
  exam: ExamResponse;
}

const today = moment();

function getRemainingDays(date: string) {
  const examDate = moment(date);
  const diff = examDate.diff(today, 'days');
  return diff;
}

function getRemainingText(diff: number) {
  if (diff > 0) {
    return `Faltam ${diff} dias`;
  } else if (diff < 0) {
    return `Passaram ${-diff} dias`;
  } else {
    return 'É hoje!';
  }
}

function getReamainingBadgeColor(diff: number) {
  if (diff > 0) {
    return 'green';
  } else if (diff < 0) {
    return 'red';
  } else {
    return 'yellow';
  }
}

function ExamCard({ exam }: ExamCardProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  const schedule = exam.reservation.schedule;
  const classes = exam.classes;
  return (
    <Flex
      direction={'column'}
      border={'1px solid'}
      boxShadow={'md'}
      borderRadius={'0.2rem'}
      padding={'1rem'}
      w={'full'}
      gap={'10px'}
      _hover={{
        boxShadow: 'lg',
        border: '2px solid',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out',
      }}
      _peerHover={{}}
    >
      <Flex direction={'row'} justify={'space-between'} w={'full'}>
        <Text fontWeight={'bold'}>
          {exam.subject_code} - {exam.subject_name}
        </Text>
      </Flex>
      <Flex justify={'space-between'} direction={isMobile ? 'column' : 'row'}>
        <Flex align={'center'}>
          <MdOutlineRoom />
          <Text ml={'5px'}>
            {`${schedule.building ? schedule.building : 'Não alocado'} - Sala ${schedule.classroom ? schedule.classroom : 'Não alocada'}`}
          </Text>
        </Flex>{' '}
        <Flex align={'center'}>
          <PiStudent />
          <Text ml={'5px'} fontWeight={'bold'}>
            Turmas{' '}
            {classes
              .map((c) => `${classNumberFromClassCode(c.code)}`)
              .join(', ') || 'Prova da disciplina'}
          </Text>
        </Flex>
      </Flex>
      {exam.times.map((time, index) => (
        <Flex align={'center'} key={index} gap={'5px'}>
          {!isMobile && <LuCalendarDays />}
          <Text ml={'2px'}>
            <Text as={'span'} fontWeight={'bold'}>
              {exam.labels[index]}
            </Text>{' '}
            no dia{' '}
            <Text as={'span'} fontWeight={'bold'}>
              {moment(exam.dates[index]).format('DD/MM/YYYY')}
            </Text>
            {`, das ${time[0].slice(0, 5)} às ${time[1].slice(0, 5)}`}
          </Text>
          <Spacer />
          <Badge
            borderRadius={'1rem'}
            colorScheme={getReamainingBadgeColor(
              getRemainingDays(exam.dates[index]),
            )}
          >
            {getRemainingText(getRemainingDays(exam.dates[index]))}
          </Badge>
        </Flex>
      ))}
    </Flex>
  );
}

export default ExamCard;
