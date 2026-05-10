import { Badge, Flex, Text } from '@chakra-ui/react';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import moment, { Moment } from 'moment';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { PiStudent } from 'react-icons/pi';
import { MdOutlineRoom } from 'react-icons/md';
import { getScheduleWithTimeString } from '../../../utils/schedules/schedule.formatter';

interface ClassCardProps {
  cls: ClassResponse;
}

function getClassStatusBadgeColor(starts: Moment[]) {
  const now = moment();
  const todayStart = starts.find((start) => start.isSame(now, 'day'));
  // Não tem aula hoje, ou não tem horário definido
  if (!todayStart) {
    return 'gray';
  }

  // Aula ainda não começou
  if (now.isBefore(todayStart)) {
    return 'yellow';
  }

  // Aula em andamento
  if (
    now.isAfter(todayStart) &&
    now.isBefore(todayStart.clone().add(1, 'hour'))
  ) {
    return 'green';
  }

  // Aula encerrada
  return 'red';
}

function getClassStatus(starts: Moment[]) {
  const now = moment();
  const todayStart = starts.find((start) => start.isSame(now, 'day'));
  if (!todayStart) {
    return 'Sem aula hoje';
  }

  if (now.isBefore(todayStart)) {
    return 'Chegando';
  }
  if (
    now.isAfter(todayStart) &&
    now.isBefore(todayStart.clone().add(1, 'hour'))
  ) {
    return 'Em andamento';
  }
  return 'Encerrada';
}

function ClassCard({ cls }: ClassCardProps) {
  const starts = cls.schedules
    .filter((s) => s.week_day != undefined)
    .map((schedule) =>
      moment(schedule.start_time).weekday(
        ((schedule.week_day as WeekDay) + 1) % 7,
      ),
    );

  return (
    <Flex
      direction={'column'}
      border={'1px solid'}
      boxShadow={'md'}
      borderRadius={'0.2rem'}
      padding={'1rem'}
      w={'full'}
      maxW={'400px'}
      gap={'10px'}
    >
      <Flex direction={'row'} justify={'space-between'} w={'full'}>
        <Text fontWeight={'bold'}>
          {cls.subject_code} - T{classNumberFromClassCode(cls.code)}
        </Text>
        <Badge
          colorScheme={getClassStatusBadgeColor(starts)}
          borderRadius={'10px'}
        >
          {getClassStatus(starts)}
        </Badge>
      </Flex>
      <Text>{cls.subject_name}</Text>
      <Flex align={'center'} justify={'flex-start'}>
        <PiStudent />
        <Text fontSize={'sm'}>
          {cls.professors.join(', ') || 'Sem professor'}
        </Text>
      </Flex>
      {cls.schedules.map((s, index) => (
        <Flex direction={'column'}>
          <Text key={`C${cls.id}-S${index}`} fontSize={'sm'}>
            {getScheduleWithTimeString(s)}
          </Text>
          <Flex align={'center'}>
            <MdOutlineRoom />
            <Text fontSize={'sm'} ml={'5px'}>
              {`${s.building ? s.building : 'Não alocado'} - Sala ${s.classroom ? s.classroom : 'Não alocada'}`}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default ClassCard;
