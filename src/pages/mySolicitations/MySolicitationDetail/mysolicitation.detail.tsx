import {
  Box,
  Button,
  Flex,
  HStack,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { BsFillPenFill } from 'react-icons/bs';
import { TbCalendarCancel, TbRefresh } from 'react-icons/tb';
import moment from 'moment';

import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import {
  ReservationStatus,
  ReservationType,
} from '../../../utils/enums/reservations.enum';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import {
  getSolicitationDates,
  getSolicitationNotice,
  getSolicitationTimeRange,
  getSolicitationTimeline,
} from '../../../utils/solicitations/solicitation.formatter';

interface MySolicitationDetailProps {
  solicitation?: SolicitationResponse;
  onEditClick: (solicitation: SolicitationResponse) => void;
  onCancelClick: (solicitation: SolicitationResponse) => void;
  onRedoClick: (solicitation: SolicitationResponse) => void;
  // When true, renders as plain full-size content for a Drawer/Modal host
  // instead of a bordered card (used on mobile).
  embedded?: boolean;
}

const STATUS_MESSAGE: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]:
    'Aguardando avaliação do responsável pelo prédio. Você ainda pode editar ou cancelar.',
  [ReservationStatus.APPROVED]:
    'Reserva confirmada. A sala já aparece na agenda do prédio.',
  [ReservationStatus.DENIED]:
    'O pedido foi recusado. Veja a justificativa abaixo.',
  [ReservationStatus.CANCELLED]:
    'Você cancelou esta solicitação. Ela não pode ser reaberta.',
  [ReservationStatus.DELETED]: 'Esta solicitação foi removida.',
};

const TIMELINE_COLORS: Record<string, string> = {
  done: '#408080',
  active: '#dcb709',
  todo: '#d7dede',
  ok: '#38A169',
  bad: '#E53E3E',
  warn: '#DD6B20',
};

function InfoField({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <VStack align={'flex-start'} spacing={'3px'}>
      <Text
        fontSize={'12px'}
        fontWeight={'bold'}
        letterSpacing={'0.06em'}
        textTransform={'uppercase'}
        color={'uspolis.textMuted'}
      >
        {label}
      </Text>
      <Text fontSize={'14.5px'} color={valueColor || 'uspolis.black'}>
        {value}
      </Text>
    </VStack>
  );
}

function MySolicitationDetail({
  solicitation,
  onEditClick,
  onCancelClick,
  onRedoClick,
  embedded = false,
}: MySolicitationDetailProps) {
  const { colorMode } = useColorMode();
  const emptyIconColor = useColorModeValue('#cfdcdc', '#4A5568');
  const noticeErrorBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)');
  const noticeErrorBorder = useColorModeValue('red.200', 'red.700');
  const noticeErrorColor = useColorModeValue('red.700', 'red.200');
  const noticeSuccessBg = useColorModeValue(
    'green.50',
    'rgba(56,161,105,0.12)',
  );
  const noticeSuccessBorder = useColorModeValue('green.200', 'green.700');
  const noticeSuccessColor = useColorModeValue('green.700', 'green.200');
  const footerBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  if (!solicitation) {
    return (
      <VStack
        h={'full'}
        justify={'center'}
        bg={embedded ? 'transparent' : 'uspolis.white'}
        border={embedded ? 'none' : '1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={embedded ? 0 : '12px'}
        p={'64px 28px'}
        spacing={'8px'}
        textAlign={'center'}
      >
        <InfoOutlineIcon boxSize={'26px'} color={emptyIconColor} />
        <Text fontSize={'15px'} fontWeight={'bold'} color={'uspolis.black'}>
          Selecione uma solicitação
        </Text>
        <Text fontSize={'13.5px'} color={'uspolis.textMuted'}>
          Os detalhes, o andamento e as ações aparecem aqui.
        </Text>
      </VStack>
    );
  }

  const scheme = ReservationStatus.getColorScheme(solicitation.status);
  const canAct = solicitation.status === ReservationStatus.PENDING;
  const canRedo =
    solicitation.status === ReservationStatus.DENIED ||
    solicitation.status === ReservationStatus.CANCELLED;
  const notice = getSolicitationNotice(solicitation);
  const timeline = getSolicitationTimeline(solicitation);
  const dates = getSolicitationDates(solicitation);
  const classroom = solicitation.reservation.classroom_name;

  return (
    <VStack
      align={'stretch'}
      spacing={0}
      bg={embedded ? 'transparent' : 'uspolis.white'}
      border={embedded ? 'none' : '1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={embedded ? 0 : '12px'}
      overflow={embedded ? 'visible' : 'hidden'}
      h={'full'}
    >
      <VStack
        align={'stretch'}
        spacing={'6px'}
        p={embedded ? '4px 4px 18px' : '18px 20px'}
        borderBottom={'1px solid'}
        borderColor={'uspolis.border'}
        bg={
          embedded
            ? 'transparent'
            : `${scheme}.${colorMode === 'dark' ? '900' : '50'}`
        }
      >
        <Flex
          align={'flex-start'}
          justify={'space-between'}
          gap={'12px'}
          wrap={'wrap'}
        >
          <Text
            fontSize={'20px'}
            fontWeight={'bold'}
            color={'uspolis.black'}
            lineHeight={1.25}
            flex={1}
            minW={'160px'}
          >
            {solicitation.reservation.title}
          </Text>
          <VStack spacing={'0px'} flex={'none'}>
            <Tag
              borderRadius={'20px'}
              colorScheme={scheme}
              fontWeight={'bold'}
              fontSize={'13.5px'}
              whiteSpace={'nowrap'}
            >
              {ReservationStatus.translate(solicitation.status)}
            </Tag>
          </VStack>
        </Flex>

        <HStack justify={'space-between'} wrap={'wrap'}>
          <Text fontSize={'14px'} color={'uspolis.textMuted'}>
            {STATUS_MESSAGE[solicitation.status]}
          </Text>
          <Text
            fontSize={'13px'}
            color={'uspolis.textMuted'}
            whiteSpace={'nowrap'}
          >
            {`Protocolo #${solicitation.id}`}
          </Text>
        </HStack>
      </VStack>

      <VStack
        align={'stretch'}
        spacing={'18px'}
        p={embedded ? '18px 4px' : '16px 20px'}
        overflowY={embedded ? 'visible' : 'auto'}
        flex={1}
      >
        <VStack align={'stretch'} spacing={0}>
          {timeline.map((step, index) => (
            <HStack key={index} align={'flex-start'} spacing={'12px'}>
              <VStack spacing={0} align={'center'} w={'22px'} flex={'none'}>
                <Box
                  w={'14px'}
                  h={'14px'}
                  mt={'3px'}
                  borderRadius={'full'}
                  bg={
                    step.state === 'todo'
                      ? 'uspolis.white'
                      : TIMELINE_COLORS[step.state]
                  }
                  border={'2px solid'}
                  borderColor={TIMELINE_COLORS[step.state]}
                  boxShadow={
                    step.state === 'active'
                      ? '0 0 0 4px rgba(220,183,9,0.18)'
                      : undefined
                  }
                />
                {index < timeline.length - 1 && (
                  <Box flex={1} w={'2px'} minH={'10px'} bg={'uspolis.border'} />
                )}
              </VStack>
              <VStack align={'flex-start'} spacing={'2px'} pb={'14px'}>
                <Text
                  fontSize={'14.5px'}
                  fontWeight={step.state === 'todo' ? 'normal' : 'bold'}
                  color={
                    step.state === 'todo'
                      ? 'uspolis.textMuted'
                      : 'uspolis.black'
                  }
                >
                  {step.label}
                </Text>
                <Text fontSize={'13px'} color={'uspolis.textMuted'}>
                  {step.sub}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>

        {notice && (
          <VStack
            align={'flex-start'}
            spacing={'5px'}
            p={'12px 14px'}
            borderRadius={'8px'}
            border={'1px solid'}
            borderColor={
              notice.tone === 'error' ? noticeErrorBorder : noticeSuccessBorder
            }
            bg={notice.tone === 'error' ? noticeErrorBg : noticeSuccessBg}
            color={
              notice.tone === 'error' ? noticeErrorColor : noticeSuccessColor
            }
          >
            <Text
              fontSize={'12px'}
              fontWeight={'bold'}
              letterSpacing={'0.06em'}
              textTransform={'uppercase'}
              opacity={0.8}
            >
              {notice.title}
            </Text>
            <Text fontSize={'14px'} lineHeight={1.5}>
              {notice.text}
            </Text>
          </VStack>
        )}

        <Wrap spacing={'14px 18px'}>
          <WrapItem>
            <InfoField
              label={'Tipo'}
              value={ReservationType.translate(solicitation.reservation.type)}
            />
          </WrapItem>
          <WrapItem>
            <InfoField
              label={'Capacidade'}
              value={`${solicitation.capacity} pessoas`}
            />
          </WrapItem>
          <WrapItem>
            <InfoField label={'Prédio'} value={solicitation.building} />
          </WrapItem>
          <WrapItem>
            <InfoField
              label={'Sala'}
              value={
                classroom
                  ? `${classroom}${solicitation.required_classroom ? ' (obrigatória)' : ''}`
                  : 'A definir pelo responsável'
              }
              valueColor={
                solicitation.status === ReservationStatus.APPROVED
                  ? 'green.500'
                  : classroom
                    ? undefined
                    : 'uspolis.textMuted'
              }
            />
          </WrapItem>
          <WrapItem>
            <InfoField
              label={'Horário'}
              value={getSolicitationTimeRange(solicitation)}
            />
          </WrapItem>
          <WrapItem>
            <InfoField
              label={'Recorrência'}
              value={Recurrence.translate(
                solicitation.reservation.schedule.recurrence,
              )}
            />
          </WrapItem>
        </Wrap>

        <VStack align={'flex-start'} spacing={'8px'}>
          <Text
            fontSize={'12px'}
            fontWeight={'bold'}
            letterSpacing={'0.06em'}
            textTransform={'uppercase'}
            color={'uspolis.textMuted'}
          >
            {`Datas (${dates.length})`}
          </Text>
          <Wrap spacing={'6px'}>
            {dates.map((date) => (
              <Tag
                key={date}
                borderRadius={'6px'}
                bg={'uspolis.surfaceSubtle'}
                color={'uspolis.textMuted'}
                fontSize={'13px'}
              >
                {moment(date).format('DD/MM/YYYY')}
              </Tag>
            ))}
          </Wrap>
        </VStack>

        <VStack align={'flex-start'} spacing={'6px'}>
          <Text
            fontSize={'12px'}
            fontWeight={'bold'}
            letterSpacing={'0.06em'}
            textTransform={'uppercase'}
            color={'uspolis.textMuted'}
          >
            Motivo
          </Text>
          <Text
            fontSize={'14.5px'}
            lineHeight={1.55}
            color={'uspolis.textMuted'}
          >
            {solicitation.reservation.reason || 'Sem descrição informada.'}
          </Text>
        </VStack>
      </VStack>

      <Flex
        mt={'auto'}
        p={embedded ? '14px 4px' : '14px 20px'}
        borderTop={'1px solid'}
        borderColor={'uspolis.border'}
        bg={embedded ? 'transparent' : footerBg}
        gap={'8px'}
        wrap={'wrap'}
        align={'center'}
      >
        {canAct && (
          <>
            <Button
              flex={{ base: '1 1 100%', sm: 1 }}
              variant={'outline'}
              colorScheme={'blue'}
              leftIcon={<BsFillPenFill size={13} />}
              onClick={() => onEditClick(solicitation)}
            >
              Editar solicitação
            </Button>
            <Button
              flex={{ base: '1 1 100%', sm: 1 }}
              variant={'outline'}
              colorScheme={'red'}
              leftIcon={<TbCalendarCancel size={16} />}
              onClick={() => onCancelClick(solicitation)}
            >
              Cancelar solicitação
            </Button>
          </>
        )}
        {canRedo && (
          <>
            <Text
              flex={'1 1 100%'}
              fontSize={'13px'}
              color={'uspolis.textMuted'}
            >
              Solicitações finalizadas não podem ser editadas.
            </Text>
            <Button
              flex={{ base: '1 1 100%', sm: 'none' }}
              variant={'outline'}
              colorScheme={'blue'}
              leftIcon={<TbRefresh size={16} />}
              onClick={() => onRedoClick(solicitation)}
            >
              Refazer solicitação
            </Button>
          </>
        )}
      </Flex>
    </VStack>
  );
}

export default MySolicitationDetail;
