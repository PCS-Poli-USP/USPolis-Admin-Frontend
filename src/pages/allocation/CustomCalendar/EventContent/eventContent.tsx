import {
  Box,
  Heading,
  Tooltip,
  Stack,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/core';
import { EventExtendedProps } from '../../../../models/http/responses/allocation.response.models';
import moment from 'moment';
import { getEventScheduleText } from '../../../../pages/allocation/utils/allocation.formatter';
import { classNumberFromClassCode } from '../../../../utils/classes/classes.formatter';

export default function EventContent(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const extendedProps: EventExtendedProps = eventData.extendedProps;
  const classData = extendedProps.class_data;
  const reservationData = extendedProps.reservation_data;
  const isTimeGridView = eventInfo.view.type.includes('timeGrid');
  const isTimeGridDay = eventInfo.view.type.includes('timeGridDay');
  const isTimeGridWeek = eventInfo.view.type.includes('timeGridWeek');
  const colorMode = localStorage.getItem('chakra-ui-color-mode');
  const isDark = colorMode === 'dark';

  return (
    <>
      {classData ? (
        <Tooltip
          bg='uspolis.white'
          placement={
            isTimeGridWeek ? 'right-end' : isTimeGridDay ? 'top' : 'auto'
          }
          label={ToolTipLabel(eventInfo)}
          borderRadius={'10px'}
          padding={'10px'}
          color={isDark ? '#FFFFFF' : 'uspolis.blue'}
          border={'1px solid'}
        >
          <Stack spacing={0}>
            {isTimeGridView && <Text noOfLines={1}>{eventInfo.timeText}</Text>}
            <Heading
              size='sm'
              alignContent={'center'}
              textColor={classData.allocated ? 'white' : 'red.300'}
            >
              {eventInfo.event.title} T
              {classNumberFromClassCode(classData.code)}
            </Heading>
            {isTimeGridView && (
              <>
                <Text noOfLines={1}>
                  {'Professores: '}
                  {classData.professors.join(', ')}
                </Text>
                <Text noOfLines={1}>
                  {`Local: ${classData.building} - ${classData.classroom}`}
                </Text>
              </>
            )}
          </Stack>
        </Tooltip>
      ) : undefined}

      {reservationData ? (
        <Tooltip
          bg='uspolis.white'
          label={ToolTipLabel(eventInfo)}
          zIndex={2500}
          placement={isTimeGridView ? 'right-end' : undefined}
        >
          <Stack spacing={0}>
            {isTimeGridView && <Text noOfLines={1}>{eventInfo.timeText}</Text>}
            <Heading size='sm' alignContent={'center'} textColor={'white'}>
              {eventInfo.event.title}
            </Heading>
            {isTimeGridView && (
              <>
                <Text noOfLines={1}>
                  {`Local: ${reservationData.building} - ${reservationData.classroom}`}
                </Text>
              </>
            )}
          </Stack>
        </Tooltip>
      ) : undefined}
      {!classData && !reservationData ? (
        <Heading size='sm' alignContent={'center'} textColor={'white'}>
          {eventInfo.event.title}
        </Heading>
      ) : undefined}
    </>
  );
}

function ToolTipLabel(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const extendedProps: EventExtendedProps = eventData.extendedProps;
  const classData = extendedProps.class_data;
  const reservationData = extendedProps.reservation_data;

  const colorMode = localStorage.getItem('chakra-ui-color-mode');
  const isDark = colorMode === 'dark';
  const textColor = isDark ? '#FFFFFF' : 'uspolis.blue';

  return (
    <VStack
      bg='uspolis.white'
      spacing={2}
      w='300px'
      alignItems='start'
      zIndex={'popover'}
    >
      {classData ? (
        <>
          <VStack spacing={'2px'} alignItems='start'>
            <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
              {`${classData.subject_code} - Turma ${classNumberFromClassCode(
                classData.code,
              )}`}
            </Text>
            <Text fontSize='lg' textColor={textColor}>
              {`${classData.subject_name}`}
            </Text>
          </VStack>
          <Box>
            <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
              Professores
            </Text>
            {(classData.professors as string[]).map((professor, index) => (
              <Text fontSize='lg' textColor={textColor} key={index}>
                {professor}
              </Text>
            ))}
          </Box>

          <Box>
            <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
              Informações
            </Text>
            <Text fontSize='lg' textColor={textColor}>{`Sala: ${
              classData.classroom_capacity
                ? `${classData.classroom} [${classData.classroom_capacity} capacidade]`
                : classData.classroom
            }`}</Text>

            <Text fontSize='lg' textColor={textColor}>
              {getEventScheduleText(extendedProps)}
            </Text>

            <Text fontSize='lg' textColor={textColor}>
              {`Horário: ${classData.start_time.substring(
                0,
                5,
              )} ~ ${classData.end_time.substring(0, 5)}`}
            </Text>

            <Text
              fontSize='lg'
              textColor={textColor}
              hidden={classData.start_date ? false : true}
            >
              {`De ${
                classData.start_date
                  ? moment(classData.start_date).format('DD/MM/YYYY')
                  : ''
              } até ${
                classData.end_date
                  ? moment(classData.end_date).format('DD/MM/YYYY')
                  : ''
              }`}
            </Text>

            <Text
              fontSize='lg'
              textColor={textColor}
            >{`Vagas: ${classData.vacancies}`}</Text>
          </Box>
        </>
      ) : undefined}

      {reservationData ? (
        <>
          <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
            {`Reserva - ${reservationData.title}`}
          </Text>

          <Box>
            <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
              Motivo
            </Text>
            <Text fontSize='lg' textColor={textColor}>
              {reservationData.reason
                ? reservationData.reason
                : 'Não informada'}
            </Text>

            <Text fontSize='xl' fontWeight='bold' textColor={textColor}>
              Local
            </Text>
            <Text fontSize='lg' textColor={textColor}>
              {`${reservationData.building} - ${reservationData.classroom}`}
            </Text>

            <Text fontSize='xl' fontWeight='bold' textColor={textColor}>
              Horários
            </Text>
            <Text fontSize='lg' textColor={textColor}>
              {getEventScheduleText(extendedProps)}
            </Text>

            <Text fontSize='lg' textColor={textColor}>
              {`Horário: ${reservationData.start_time.substring(
                0,
                5,
              )} ~ ${reservationData.end_time.substring(0, 5)}`}
            </Text>

            <Text
              fontSize='lg'
              textColor={textColor}
              hidden={reservationData.start_date ? false : true}
            >
              {`De ${
                reservationData.start_date
                  ? moment(reservationData.start_date).format('DD/MM/YYYY')
                  : ''
              } até ${
                reservationData.end_date
                  ? moment(reservationData.end_date).format('DD/MM/YYYY')
                  : ''
              }`}
            </Text>
          </Box>
        </>
      ) : undefined}
    </VStack>
  );
}
