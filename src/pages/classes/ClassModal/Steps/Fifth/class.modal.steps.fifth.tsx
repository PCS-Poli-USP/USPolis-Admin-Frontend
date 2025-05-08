import {
  Button,
  Divider,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ClassType } from '../../../../../utils/enums/classes.enum';
import moment from 'moment';
import { BsCalendar2WeekFill } from 'react-icons/bs';
import { WarningIcon } from '@chakra-ui/icons';
import { ClassModalFifthStepProps } from './class.modal.steps.fifth.interface';
import { getScheduleFullString } from '../../../../../utils/schedules/schedule.formatter';
import { AudiovisualType } from '../../../../../utils/enums/audiovisualType.enum';

function ClassModalFifthStep(props: ClassModalFifthStepProps) {
  const firstForm = props.data.first;
  const secondForm = props.data.second;
  const fourthForm = props.data.fourth;

  const subject_id = Number(firstForm.subject_id);
  const subject = props.subjects.find((subject) => subject.id === subject_id);
  const calendars = props.calendars.filter((calendar) => {
    if (secondForm.calendar_ids)
      return secondForm.calendar_ids.includes(calendar.id);
    return false;
  });

  const calendarsNames = calendars.map((calendar) => calendar.name);

  return (
    <VStack mt={5} ml={5} mb={5} width={'100%'} align={'stretch'}>
      <HStack align={'center'}>
        <Heading size={'md'}>Informações da Turma</Heading>
        <Button
          size={'sm'}
          variant={'ghost'}
          colorScheme={'yellow'}
          onClick={() => props.moveTo(0)}
        >
          Editar
        </Button>
      </HStack>

      <HStack>
        <Text as={'b'}>{`Disciplina: `}</Text>
        <Text color={subject ? undefined : 'red'}>
          {subject ? subject.name : 'Não encontrada'}
        </Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Código: `}</Text>
        <Text color={subject ? undefined : 'red'}>
          {firstForm.code ? firstForm.code : 'Não informada'}
        </Text>
      </HStack>
      <HStack>
        <Text as={'b'}>Oferecimento: </Text>
        <Text>{`Vagas - ${firstForm.vacancies}`}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Tipo: `}</Text>
        <Text color={firstForm.type ? undefined : 'red'}>
          {firstForm.type
            ? ClassType.translate(firstForm.type)
            : 'Não informado'}
        </Text>
      </HStack>
      <HStack>
        <Text as={'b'}>Professores: </Text>
        <Text color={firstForm.professors.length > 0 ? undefined : 'red'}>
          {firstForm.professors.length > 0
            ? firstForm.professors.join(', ')
            : 'Não informado'}
        </Text>
      </HStack>

      <Divider />

      <HStack align={'center'} mt={2}>
        <Heading size={'md'}>Datas da Turma</Heading>
        <Button
          size={'sm'}
          variant={'ghost'}
          colorScheme={'yellow'}
          onClick={() => props.moveTo(1)}
        >
          Editar
        </Button>
      </HStack>

      <HStack>
        <Text as={'b'}>{`Datas: `}</Text>
        <Text>{`Início - ${moment(secondForm.start_date).format(
          'DD/MM/YYYY',
        )}`}</Text>
        <Text>{`Fim - ${moment(secondForm.end_date).format(
          'DD/MM/YYYY',
        )}`}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Calendários: `}</Text>
        <Text
          // fontWeight={calendarsNames.length === 0 ? 'bold' : undefined}
          color={calendarsNames.length !== 0 ? undefined : 'red'}
        >
          {calendarsNames.length !== 0
            ? calendarsNames.join(', ')
            : 'Nenhum calendário escolhido'}
        </Text>
      </HStack>

      <Divider />

      <HStack align={'center'} mt={2}>
        <Heading size={'md'}>Horários da Turma</Heading>
        <Button
          size={'sm'}
          variant={'ghost'}
          colorScheme={'yellow'}
          onClick={() => props.moveTo(2)}
        >
          Editar
        </Button>
      </HStack>

      <Text as={'b'}>Agendas: </Text>
      <List>
        {props.schedules.map((schedule, index) => (
          <ListItem key={index}>
            <HStack>
              <ListIcon as={BsCalendar2WeekFill} />
              <Text>{getScheduleFullString(schedule)}</Text>
              <Text ml={4} fontWeight={'bold'} textColor={'red.500'}>
                {schedule.allocated ? 'Alocado' : ''}
              </Text>
            </HStack>
          </ListItem>
        ))}
        {props.schedules.length === 0 ? (
          <ListItem color={'red'}>
            <ListIcon as={WarningIcon} />
            Nenhuma agenda encontrada
          </ListItem>
        ) : undefined}
      </List>

      <Divider />

      <HStack align={'center'} mt={2}>
        <Heading size={'md'}>Preferências da Turma</Heading>
        <Button
          size={'sm'}
          variant={'ghost'}
          colorScheme={'yellow'}
          onClick={() => props.moveTo(3)}
        >
          Editar
        </Button>
      </HStack>

      <HStack>
        <Text as={'b'}>{`Ignorar para alocação: `}</Text>
        <Text>{fourthForm.ignore_to_allocate ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Ar Condicionado: `}</Text>
        <Text>{fourthForm.air_conditionating ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Acessibilidade: `}</Text>
        <Text>{fourthForm.accessibility ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Recurso audiovisual: `}</Text>
        <Text color={fourthForm.audiovisual ? undefined : 'red'}>
          {fourthForm.audiovisual
            ? AudiovisualType.translate(fourthForm.audiovisual)
            : 'Não informado'}
        </Text>
      </HStack>
      <Divider />
    </VStack>
  );
}

export default ClassModalFifthStep;
