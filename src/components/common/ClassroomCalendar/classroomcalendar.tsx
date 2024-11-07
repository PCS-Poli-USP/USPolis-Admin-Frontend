import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ClassroomCalendarProps } from './classroomcalendar.interface';
import { FaLessThan, FaGreaterThan } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { CloseIcon } from '@chakra-ui/icons';
import { OccurrenceResponse } from 'models/http/responses/occurrence.response.models';
import { BsCalendarFill } from 'react-icons/bs';

function ClassroomCalendar({ classroom, h, w }: ClassroomCalendarProps) {
  const {
    isOpen: isOpenSelectDate,
    onOpen: onOpenSelectDate,
    onClose: onCloseSelectDate,
  } = useDisclosure();

  const DATE_FORMAT = 'DD/MM/YYYY';
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const defaultOccurrencesByTime: [string, string, OccurrenceResponse[]][] = [
    ['06:00', '07:00', []],
    ['07:00', '08:00', []],
    ['08:00', '09:00', []],
    ['09:00', '10:00', []],
    ['10:00', '11:00', []],
    ['11:00', '12:00', []],
    ['12:00', '13:00', []],
    ['13:00', '14:00', []],
    ['14:00', '15:00', []],
    ['15:00', '16:00', []],
    ['16:00', '17:00', []],
    ['17:00', '18:00', []],
    ['18:00', '19:00', []],
    ['19:00', '20:00', []],
    ['20:00', '21:00', []],
    ['21:00', '22:00', []],
    ['22:00', '23:00', []],
    ['23:00', '24:00', []],
  ];
  const [occurrencesByTime, setOccurrencesByTime] = useState<
    [string, string, OccurrenceResponse[]][]
  >(defaultOccurrencesByTime);
  const [conflicts, setConflicts] = useState(0);

  function getOccurrencesByTime(occurrences: OccurrenceResponse[]) {
    const newOccurencesByTime: [string, string, OccurrenceResponse[]][] = [];
    let newConflicts = 0;
    for (let i = 0; i < defaultOccurrencesByTime.length; i++) {
      const startTime = moment(defaultOccurrencesByTime[i][0], 'HH:mm');
      const endTime = moment(defaultOccurrencesByTime[i][1], 'HH:mm');
      const filteredOccurrences = occurrences.filter((occur) => {
        const occurrenceStartTime = moment(occur.start_time, 'HH:mm');
        const occurrenceEndTime = moment(occur.end_time, 'HH:mm');
        if (
          occurrenceStartTime.isSameOrAfter(startTime) &&
          occurrenceEndTime.isSameOrBefore(endTime)
        ) {
          return true;
        }
        if (
          occurrenceStartTime.isSameOrBefore(startTime) &&
          occurrenceEndTime.isSameOrBefore(endTime)
        ) {
          return true;
        }
        if (
          occurrenceStartTime.isSameOrBefore(endTime) &&
          occurrenceEndTime.isSameOrAfter(endTime)
        ) {
          return true;
        }
        if (
          occurrenceStartTime.isSameOrBefore(startTime) &&
          occurrenceEndTime.isSameOrAfter(endTime)
        ) {
          return true;
        }
        return false;
      });
      if (filteredOccurrences.length > 0) {
        newConflicts += 1;
      }
      newOccurencesByTime.push([
        startTime.format('HH:mm'),
        endTime.format('HH:mm'),
        filteredOccurrences,
      ]);
    }
    setConflicts(newConflicts);
    return newOccurencesByTime;
  }

  useEffect(() => {
    if (classroom) {
      const occurrences = classroom.schedules.reduce<OccurrenceResponse[]>(
        (acc, schedule) => acc.concat(schedule.occurrences),
        [],
      );
      const filteredOccurrences = occurrences.filter(
        (occur) => occur.date === currentDate.format('YYYY-MM-DD'),
      );
      setOccurrencesByTime(getOccurrencesByTime(filteredOccurrences));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, currentDate]);

  return (
    <Box
      p={3}
      alignSelf={'stretch'}
      h={'stretch'}
      w={w ? w : 'auto'}
      maxW={w}
      maxH={'auto'}
    >
      <VStack
        w={'stretch'}
        h={'stretch'}
        maxH={'auto'}
        divider={<Divider borderColor={'black.900'} />}
      >
        <HStack w={'stretch'}>
          <Text
            noOfLines={1}
            align={'center'}
            w={55}
            maxW={55}
            textOverflow={'ellipsis'}
            fontWeight={'bold'}
          >{`${classroom ? classroom.name : 'Não selecionada'}`}</Text>
          <Text fontWeight={'bold'}>{`${currentDate.format(
            DATE_FORMAT,
          )}`}</Text>
          <IconButton
            aria-label='Escolher data'
            variant={'ghost'}
            colorScheme={'teal'}
            onClick={() => {
              onOpenSelectDate();
            }}
            icon={<BsCalendarFill />}
          />
          <IconButton
            isRound={true}
            colorScheme={'teal'}
            variant={'ghost'}
            aria-label={'Anterior'}
            size={'sm'}
            icon={<FaLessThan />}
            onClick={() => {
              setCurrentDate((prev) => prev.subtract(1, 'day').clone());
            }}
          />
          <IconButton
            isRound={true}
            colorScheme={'teal'}
            variant={'ghost'}
            aria-label={'Próximo'}
            size={'sm'}
            icon={<FaGreaterThan />}
            onClick={() => {
              setCurrentDate((prev) => prev.add(1, 'day').clone());
            }}
          />
        </HStack>
        <Text>{`${occurrencesByTime.length - conflicts} horários livres`}</Text>
        <VStack
          alignSelf={'flex-start'}
          align={'stretch'}
          divider={<Divider />}
          h={'100%'}
          maxH={h}
          maxW={w}
          w={'stretch'}
          overflowY={'auto'}
        >
          {occurrencesByTime.map((map, index) => (
            <Flex direction='row' width='stretch' key={index}>
              <Text fontWeight={'light'}>{`${map[0]} - ${map[1]}:`}</Text>
              <Box flex='1' ml={5}>
                <Text
                  textAlign='left'
                  color={map[2].length > 0 ? 'red' : 'teal'}
                >
                  {map[2].length > 0 ? 'Ocupado' : 'Disponível'}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </VStack>
      <Modal isOpen={isOpenSelectDate} onClose={onCloseSelectDate}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <HStack align={'start'}>
              <Input
                type={'date'}
                onChange={(event) => {
                  if (event.target.value) {
                    setCurrentDate(moment(event.target.value));
                    onCloseSelectDate();
                  }
                }}
              />
              <IconButton
                colorScheme={'teal'}
                variant={'ghost'}
                aria-label={'Fechar'}
                icon={<CloseIcon />}
                onClick={() => onCloseSelectDate()}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ClassroomCalendar;
