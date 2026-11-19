import { CopyIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import { ReactNode } from 'react';
import { BiSolidCalendarEdit } from 'react-icons/bi';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { LuEye } from 'react-icons/lu';

import CardList from '../../components/common/CardList/CardList';
import { CardFilter } from '../../components/common/CardList/CardFilters';
import { ReservationResponse } from '../../models/http/responses/reservation.response.models';
import {
  ReservationStatus,
  ReservationType,
} from '../../utils/enums/reservations.enum';
import { getScheduleString } from '../../utils/schedules/schedule.formatter';

interface Props {
  reservations: ReservationResponse[];
  loading: boolean;
  handleViewClick: (reservation: ReservationResponse) => void;
  handleDuplicateClick: (reservation: ReservationResponse) => void;
  handleEditClick: (reservation: ReservationResponse) => void;
  handleDeleteClick: (reservation: ReservationResponse) => void;
  handleEditOccurrencesClick: (reservation: ReservationResponse) => void;
  toolbarAction: ReactNode;
}

const formatDate = (date: string) => moment(date).format('DD/MM/YYYY');

export default function ReservationCardList({
  reservations,
  loading,
  handleViewClick,
  handleDuplicateClick,
  handleEditClick,
  handleDeleteClick,
  handleEditOccurrencesClick,
  toolbarAction,
}: Props) {
  const filters: CardFilter<ReservationResponse>[] = [
    {
      key: 'title',
      label: 'Título',
      type: 'text',
      placeholder: 'Buscar por título',
    },
    {
      key: 'status',
      label: 'Situação',
      type: 'select',
      options: ReservationStatus.getValues().map((status) => ({
        value: ReservationStatus.translate(status),
        label: ReservationStatus.translate(status),
      })),
      getValue: (reservation) =>
        ReservationStatus.translate(
          reservation.status ?? ReservationStatus.APPROVED,
        ),
    },
    {
      key: 'solicitation',
      label: 'Solicitação',
      type: 'select',
      options: [
        { value: 'Sim', label: 'Sim' },
        { value: 'Não', label: 'Não' },
      ],
      getValue: (reservation) =>
        reservation.solicitation_id ? 'Sim' : 'Não',
    },
    {
      key: 'building',
      label: 'Prédio',
      type: 'select',
      options: Array.from(
        new Set(reservations.map((reservation) => reservation.building_name)),
      )
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right))
        .map((building) => ({ value: building, label: building })),
      getValue: (reservation) => reservation.building_name,
    },
    {
      key: 'classroom',
      label: 'Sala',
      type: 'text',
      placeholder: 'Buscar por sala',
      getValue: (reservation) => reservation.classroom_name ?? '',
    },
    {
      key: 'requester',
      label: 'Solicitante',
      type: 'text',
      placeholder: 'Buscar por solicitante',
      getValue: (reservation) =>
        reservation.requester ?? reservation.created_by,
    },
    {
      key: 'type',
      label: 'Tipo',
      type: 'select',
      options: ReservationType.getValues().map((type) => ({
        value: ReservationType.translate(type),
        label: ReservationType.translate(type),
      })),
      getValue: (reservation) => ReservationType.translate(reservation.type),
    },
    {
      key: 'recurrence',
      label: 'Recorrência',
      type: 'text',
      placeholder: 'Buscar por recorrência',
      getValue: (reservation) => getScheduleString(reservation.schedule),
    },
    {
      key: 'time',
      label: 'Horário',
      type: 'text',
      placeholder: 'Buscar por horário',
      getValue: (reservation) =>
        `${reservation.schedule.start_time.substring(0, 5)} ~ ${reservation.schedule.end_time.substring(0, 5)}`,
    },
    {
      key: 'period',
      label: 'Período',
      type: 'text',
      placeholder: 'Buscar por período',
      getValue: (reservation) =>
        `${formatDate(reservation.schedule.start_date)} até ${formatDate(reservation.schedule.end_date)}`,
      getSortValue: (reservation) => reservation.schedule.start_date,
    },
  ];

  return (
    <CardList
      items={reservations}
      loading={loading}
      emptyMessage="Nenhuma reserva encontrada."
      filters={filters}
      columns={{ base: 1 }}
      toolbarAction={toolbarAction}
      renderCard={(reservation) => {
        const status =
          reservation.status ?? ReservationStatus.APPROVED;

        return (
          <Flex
            key={reservation.id}
            bg="uspolis.white"
            border="1px solid"
            borderColor="uspolis.border"
            borderRadius="10px"
            overflow="hidden"
            w="100%"
          >
            <VStack align="stretch" spacing="12px" flex={1} minW={0} p="14px">
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Heading
                  size="md"
                  color="uspolis.black"
                  flex={1}
                  minW={0}
                  overflowWrap="anywhere"
                >
                  {reservation.title}
                </Heading>
                <Tag
                  flex="none"
                  borderRadius="20px"
                  colorScheme={ReservationStatus.getColorScheme(status)}
                >
                  {ReservationStatus.translate(status)}
                </Tag>
              </Flex>

              <HStack spacing="6px" flexWrap="wrap" rowGap="6px">
                <Tag colorScheme="blue">
                  {ReservationType.translate(reservation.type)}
                </Tag>
                <Tag colorScheme={reservation.solicitation_id ? 'purple' : 'gray'}>
                  {reservation.solicitation_id
                    ? 'Solicitação'
                    : 'Reserva'}
                </Tag>
              </HStack>

              <Flex
                wrap="wrap"
                columnGap="18px"
                rowGap="6px"
                fontSize="13.5px"
                color="uspolis.textMuted"
              >
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Prédio
                  </Text>
                  <Text overflowWrap="anywhere">{reservation.building_name}</Text>
                </HStack>
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Sala
                  </Text>
                  <Text>{reservation.classroom_name ?? 'Não alocada'}</Text>
                </HStack>
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Solicitante
                  </Text>
                  <Text overflowWrap="anywhere">
                    {reservation.requester ?? reservation.created_by}
                  </Text>
                </HStack>
              </Flex>

              <Flex
                wrap="wrap"
                columnGap="18px"
                rowGap="6px"
                fontSize="13.5px"
                color="uspolis.textMuted"
              >
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Recorrência
                  </Text>
                  <Text>{getScheduleString(reservation.schedule)}</Text>
                </HStack>
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Horário
                  </Text>
                  <Text>{`${reservation.schedule.start_time.substring(
                    0,
                    5,
                  )} ~ ${reservation.schedule.end_time.substring(0, 5)}`}</Text>
                </HStack>
                <HStack spacing="7px">
                  <Text fontWeight="medium" color="uspolis.text">
                    Período
                  </Text>
                  <Text>{`${formatDate(
                    reservation.schedule.start_date,
                  )} até ${formatDate(reservation.schedule.end_date)}`}</Text>
                </HStack>
              </Flex>

              <Divider borderColor="uspolis.border" />

              <HStack spacing="2" flexWrap="wrap" rowGap="2">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<LuEye />}
                  onClick={() => handleViewClick(reservation)}
                  isDisabled={!reservation.classroom_id}
                >
                  Visualizar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="cyan"
                  leftIcon={<CopyIcon />}
                  onClick={() => handleDuplicateClick(reservation)}
                >
                  Duplicar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="yellow"
                  leftIcon={<BsFillPenFill />}
                  onClick={() => handleEditClick(reservation)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="yellow"
                  leftIcon={<BiSolidCalendarEdit />}
                  onClick={() => handleEditOccurrencesClick(reservation)}
                >
                  Editar ocorrências
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  leftIcon={<BsFillTrashFill />}
                  onClick={() => handleDeleteClick(reservation)}
                  isDisabled={status === ReservationStatus.DELETED}
                >
                  Remover
                </Button>
              </HStack>
            </VStack>
          </Flex>
        );
      }}
    />
  );
}
