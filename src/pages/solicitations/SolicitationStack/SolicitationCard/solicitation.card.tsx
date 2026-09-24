import {
  Box,
  Flex,
  HStack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { TbCalendarEvent } from 'react-icons/tb';

import { SolicitationResponse } from '../../../../models/http/responses/solicitation.response.models';
import {
  ReservationStatus,
  ReservationType,
} from '../../../../utils/enums/reservations.enum';
import { Recurrence } from '../../../../utils/enums/recurrence.enum';
import {
  getSolicitationAdminFootnote,
  getSolicitationDates,
  getSolicitationPlace,
  getSolicitationTimeRange,
} from '../../../../utils/solicitations/solicitation.formatter';

interface SolicitationCardProps {
  solicitation: SolicitationResponse;
  onClick: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function SolicitationCard({ solicitation, onClick }: SolicitationCardProps) {
  const metaIconColor = useColorModeValue('#66666A', '#A0AEC0');
  const scheme = ReservationStatus.getColorScheme(solicitation.status);
  const closed = solicitation.status !== ReservationStatus.PENDING;
  const dates = getSolicitationDates(solicitation);
  const visibleDates = dates.slice(0, 3);
  const extraDates = dates.length - visibleDates.length;
  const missingClassroom = !solicitation.reservation.classroom_name;

  return (
    <Flex
      bg={'uspolis.white'}
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'10px'}
      overflow={'hidden'}
      cursor={'pointer'}
      opacity={closed ? 0.72 : 1}
      transition={'border-color 0.15s, box-shadow 0.15s'}
      _hover={{ borderColor: 'uspolis.blue', boxShadow: '0 4px 14px rgba(64,128,128,0.16)' }}
      onClick={onClick}
    >
      <Box flex={'none'} w={'5px'} alignSelf={'stretch'} bg={`${scheme}.400`} />
      <VStack align={'stretch'} spacing={'10px'} flex={1} minW={0} p={{ base: '12px', md: '14px 16px' }}>
        <HStack align={'center'} spacing={'8px'}>
          <Tag borderRadius={'20px'} colorScheme={scheme} fontSize={'12px'} fontWeight={'bold'}>
            {ReservationStatus.translate(solicitation.status)}
          </Tag>
          <Tag borderRadius={'4px'} bg={'uspolis.surfaceSubtle'} color={'uspolis.text'} fontSize={'12px'} fontWeight={'medium'}>
            {ReservationType.translate(solicitation.reservation.type)}
          </Tag>
          <Text fontSize={'12px'} color={'uspolis.textMuted'} whiteSpace={'nowrap'}>
            {`#${solicitation.id}`}
          </Text>
          <Box flex={1} />
          <Text fontSize={'13px'} color={'uspolis.textMuted'} whiteSpace={'nowrap'}>
            {moment(solicitation.created_at).fromNow()}
          </Text>
        </HStack>

        <Text
          fontSize={'18px'}
          fontWeight={'bold'}
          color={'uspolis.darkBlue'}
          lineHeight={1.3}
          noOfLines={1}
        >
          {solicitation.reservation.title}
        </Text>

        <VStack align={'stretch'} spacing={'6px'} fontSize={'14px'} color={'uspolis.text'}>
          <HStack spacing={'8px'}>
            <FiMapPin color={metaIconColor} />
            <Text noOfLines={1}>{getSolicitationPlace(solicitation)}</Text>
          </HStack>
          <HStack spacing={'8px'}>
            <FiClock color={metaIconColor} />
            <Text>{`${getSolicitationTimeRange(solicitation)} · ${Recurrence.translate(solicitation.reservation.schedule.recurrence)}`}</Text>
          </HStack>
          {visibleDates.length > 0 && (
            <HStack spacing={'6px'} flexWrap={'wrap'} rowGap={'6px'}>
              <TbCalendarEvent color={metaIconColor} style={{ marginRight: '2px' }} />
              {visibleDates.map((date) => (
                <Tag key={date} borderRadius={'4px'} border={'1px solid'} borderColor={'uspolis.border'} bg={'transparent'} fontSize={'12px'} color={'uspolis.text'}>
                  {moment(date).format('DD/MM')}
                </Tag>
              ))}
              {extraDates > 0 && (
                <Text fontSize={'12px'} color={'uspolis.textMuted'}>{`+${extraDates}`}</Text>
              )}
            </HStack>
          )}
        </VStack>

        <Flex
          align={'center'}
          gap={'10px'}
          pt={'12px'}
          borderTop={'1px solid'}
          borderColor={'uspolis.border'}
        >
          <Flex
            w={'28px'}
            h={'28px'}
            borderRadius={'50%'}
            bg={'uspolis.lightBlue'}
            color={'uspolis.darkBlue'}
            align={'center'}
            justify={'center'}
            fontSize={'11px'}
            fontWeight={'bold'}
            flex={'none'}
          >
            {getInitials(solicitation.user)}
          </Flex>
          <VStack align={'flex-start'} spacing={0} flex={1} minW={0} fontSize={'13px'} lineHeight={1.3}>
            <Text fontWeight={'medium'} color={'uspolis.text'} noOfLines={1}>
              {solicitation.user}
            </Text>
            <Text color={'uspolis.textMuted'}>
              {getSolicitationAdminFootnote(solicitation)}
            </Text>
          </VStack>
          {!closed && missingClassroom && (
            <Tag
              flex={'none'}
              borderRadius={'4px'}
              fontSize={'12px'}
              fontWeight={'bold'}
              colorScheme={'orange'}
              whiteSpace={'nowrap'}
            >
              Definir sala
            </Tag>
          )}
        </Flex>
      </VStack>
    </Flex>
  );
}

export default SolicitationCard;
