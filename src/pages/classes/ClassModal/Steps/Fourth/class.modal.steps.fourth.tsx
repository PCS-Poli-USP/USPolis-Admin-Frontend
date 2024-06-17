import {
  Button,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ClassModalFourthStepProps } from './class.modal.steps.fourth.interface';
import { ClassType } from 'utils/enums/classes.enum';
import moment from 'moment';
import { scheduleToString } from '../class.modal.steps.utils';
import { BsCalendar2WeekFill } from 'react-icons/bs';
import { WarningIcon } from '@chakra-ui/icons';

function ClassModalFourthStep(props: ClassModalFourthStepProps) {
  const firstForm = props.data.first;
  const seccondForm = props.data.second;
  const thirdForm = props.data.third;

  const subject_id = Number(firstForm.subject_id);
  const subject = props.subjects.find((subject) => subject.id === subject_id);
  const calendars = props.calendars.filter((calendar) =>
    seccondForm.calendar_ids.includes(calendar.id),
  );

  const calendarsNames = calendars.map((calendar) => calendar.name);

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <HStack align={'center'}>
        <Heading size={'lg'}>Informações da Turma</Heading>
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
        <Text>{subject ? subject.name : 'Não encontrada'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Código: `}</Text>
        <Text>{firstForm.code}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>Oferecimento: </Text>
        <Text>{`Vagas - ${firstForm.subscribers}`}</Text>
        <Text>{`Inscritos - ${firstForm.subscribers}`}</Text>
        <Text>{`Pendentes - ${firstForm.subscribers}`}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Tipo: `}</Text>
        <Text>{ClassType.translate(firstForm.type)}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>Professores: </Text>
        <Text>{firstForm.professors.join(', ')}</Text>
      </HStack>

      <HStack align={'center'} mt={5}>
        <Heading size={'lg'}>Horários e Datas da Turma</Heading>
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
        <Text>{`Início - ${moment(seccondForm.start_date).format(
          'DD/MM/YYYY',
        )}`}</Text>
        <Text>{`Fim - ${moment(seccondForm.end_date).format(
          'DD/MM/YYYY',
        )}`}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Calendários: `}</Text>
        <Text color={calendarsNames.length === 0 ? 'red' : undefined}>
          {calendarsNames.length !== 0
            ? calendarsNames.join(', ')
            : 'Nenhum calendário encontrado'}
        </Text>
      </HStack>
      <Text as={'b'}>Agendas: </Text>
      <List>
        {props.schedules.map((schedule, index) => (
          <ListItem key={index}>
            <ListIcon as={BsCalendar2WeekFill} />
            {scheduleToString(schedule)}
          </ListItem>
        ))}
        {props.schedules.length === 0 ? (
          <ListItem color={'red'}>
            <ListIcon as={WarningIcon} />
            Nenhuma agenda encontrada
          </ListItem>
        ) : undefined}
      </List>

      <HStack align={'center'} mt={5}>
        <Heading size={'lg'}>Preferências da Turma</Heading>
        <Button
          size={'sm'}
          variant={'ghost'}
          colorScheme={'yellow'}
          onClick={() => props.moveTo(2)}
        >
          Editar
        </Button>
      </HStack>

      <HStack>
        <Text as={'b'}>{`Ignorar calendários e feriados: `}</Text>
        <Text>{thirdForm.skip_exceptions ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Ignorar para alocação: `}</Text>
        <Text>{thirdForm.ignore_to_allocate ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Projetor: `}</Text>
        <Text>{thirdForm.projector ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Ar Condicionado: `}</Text>
        <Text>{thirdForm.air_conditionating ? 'Sim' : 'Não'}</Text>
      </HStack>
      <HStack>
        <Text as={'b'}>{`Acessibilidade: `}</Text>
        <Text>{thirdForm.accessibility ? 'Sim' : 'Não'}</Text>
      </HStack>
    </VStack>
  );
}

export default ClassModalFourthStep;
