import { Box, Flex, HStack, Tag, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { BsFillPenFill } from 'react-icons/bs';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { TbCalendarCancel, TbCalendarEvent } from 'react-icons/tb';

import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { ReservationStatus, ReservationType } from '../../../utils/enums/reservations.enum';
import {
  getSolicitationDatesSummary,
  getSolicitationPlace,
  getSolicitationTimeRange,
  getSolicitationUpdatedText,
} from '../../../utils/solicitations/solicitation.formatter';

interface MySolicitationCardProps {
  solicitation: SolicitationResponse;
  selected: boolean;
  onClick: () => void;
  onEditClick: (solicitation: SolicitationResponse) => void;
  onCancelClick: (solicitation: SolicitationResponse) => void;
}

function MySolicitationCard({
  solicitation,
  selected,
  onClick,
  onEditClick,
  onCancelClick,
}: MySolicitationCardProps) {
  const canAct = solicitation.status === ReservationStatus.PENDING;
  const scheme = ReservationStatus.getColorScheme(solicitation.status);
  const metaIconColor = useColorModeValue('#66666A', '#A0AEC0');

  return (
    <Flex
      bg={'uspolis.white'}
      border={'1px solid'}
      borderColor={selected ? 'uspolis.blue' : 'uspolis.border'}
      borderRadius={'10px'}
      overflow={'hidden'}
      cursor={'pointer'}
      opacity={solicitation.status === ReservationStatus.CANCELLED ? 0.75 : 1}
      boxShadow={selected ? '0 0 0 2px rgba(64,128,128,0.15)' : 'none'}
      transition={'border-color 0.15s, box-shadow 0.15s'}
      _hover={{ borderColor: 'uspolis.blue' }}
      onClick={onClick}
    >
      <Box flex={'none'} w={'5px'} alignSelf={'stretch'} bg={`${scheme}.400`} />
      <VStack align={'stretch'} spacing={'10px'} flex={1} minW={0} p={{ base: '12px', md: '14px 16px' }}>
        <HStack align={'flex-start'} spacing={3}>
          <VStack align={'flex-start'} spacing={'3px'} flex={1} minW={0}>
            <Text
              fontSize={'16px'}
              fontWeight={'bold'}
              color={'uspolis.black'}
              noOfLines={1}
            >
              {solicitation.reservation.title}
            </Text>
            <HStack spacing={2} fontSize={'13px'} color={'uspolis.textMuted'}>
              <Text fontWeight={'medium'} color={'uspolis.text'}>
                {ReservationType.translate(solicitation.reservation.type)}
              </Text>
              <Text>·</Text>
              <Text>{`#${solicitation.id}`}</Text>
            </HStack>
          </VStack>
          <Tag
            flex={'none'}
            borderRadius={'20px'}
            colorScheme={scheme}
            fontSize={'12.5px'}
            fontWeight={'bold'}
          >
            {ReservationStatus.translate(solicitation.status)}
          </Tag>
        </HStack>

        <Flex wrap={'wrap'} columnGap={'18px'} rowGap={'6px'} fontSize={'13.5px'} color={'uspolis.textMuted'}>
          <HStack spacing={'7px'}>
            <FiMapPin color={metaIconColor} />
            <Text>{getSolicitationPlace(solicitation)}</Text>
          </HStack>
          <HStack spacing={'7px'}>
            <FiClock color={metaIconColor} />
            <Text>{getSolicitationTimeRange(solicitation)}</Text>
          </HStack>
          <HStack spacing={'7px'}>
            <TbCalendarEvent color={metaIconColor} />
            <Text>{getSolicitationDatesSummary(solicitation)}</Text>
          </HStack>
        </Flex>

        <Flex wrap={'wrap'} rowGap={'8px'} columnGap={3} align={'center'}>
          <Text fontSize={'12.5px'} color={'uspolis.textMuted'}>
            {getSolicitationUpdatedText(solicitation)}
          </Text>
          <Box flex={1} minW={'8px'} />
          {canAct && (
            <HStack spacing={'6px'} onClick={(e) => e.stopPropagation()}>
              <Tag
                as={'button'}
                onClick={() => onEditClick(solicitation)}
                size={'md'}
                variant={'outline'}
                colorScheme={'blue'}
                cursor={'pointer'}
                gap={'6px'}
              >
                <BsFillPenFill size={11} />
                Editar
              </Tag>
              <Tag
                as={'button'}
                onClick={() => onCancelClick(solicitation)}
                size={'md'}
                variant={'outline'}
                colorScheme={'red'}
                cursor={'pointer'}
                gap={'6px'}
              >
                <TbCalendarCancel size={13} />
                Cancelar
              </Tag>
            </HStack>
          )}
        </Flex>
      </VStack>
    </Flex>
  );
}

export default MySolicitationCard;
