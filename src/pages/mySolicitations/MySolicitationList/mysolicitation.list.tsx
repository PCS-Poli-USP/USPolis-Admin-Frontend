import { Box, Button, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import MySolicitationCard from '../MySolicitationCard/mysolicitation.card';

interface MySolicitationListProps {
  solicitations: SolicitationResponse[];
  selectedId?: number;
  onSelect: (solicitation: SolicitationResponse) => void;
  onEditClick: (solicitation: SolicitationResponse) => void;
  onCancelClick: (solicitation: SolicitationResponse) => void;
  onNewClick: () => void;
}

const GROUP_ORDER = [
  ReservationStatus.PENDING,
  ReservationStatus.APPROVED,
  ReservationStatus.DENIED,
  ReservationStatus.CANCELLED,
  ReservationStatus.DELETED,
];

function MySolicitationList({
  solicitations,
  selectedId,
  onSelect,
  onEditClick,
  onCancelClick,
  onNewClick,
}: MySolicitationListProps) {
  const sections = GROUP_ORDER.map((status) => ({
    status,
    items: solicitations.filter((s) => s.status === status),
  })).filter((section) => section.items.length > 0);

  if (sections.length === 0) {
    return (
      <VStack
        spacing={'10px'}
        p={{ base: '36px 18px', md: '56px 24px' }}
        border={'1px dashed'}
        borderColor={'uspolis.border'}
        borderRadius={'12px'}
        bg={'uspolis.white'}
        textAlign={'center'}
      >
        <Text fontSize={'17px'} fontWeight={'bold'} color={'uspolis.black'}>
          Nenhuma solicitação encontrada
        </Text>
        <Text fontSize={'14px'} color={'uspolis.textMuted'} maxW={'380px'}>
          Ajuste os filtros ou crie uma nova solicitação de reserva de sala.
        </Text>
        <Button
          mt={'6px'}
          colorScheme={'blue'}
          leftIcon={<AddIcon boxSize={'10px'} />}
          onClick={onNewClick}
        >
          Nova solicitação
        </Button>
      </VStack>
    );
  }

  return (
    <VStack align={'stretch'} spacing={'20px'}>
      {sections.map((section) => {
        const scheme = ReservationStatus.getColorScheme(section.status);
        return (
          <VStack key={section.status} align={'stretch'} spacing={'10px'}>
            <HStack spacing={'10px'}>
              <Box w={'9px'} h={'9px'} borderRadius={'full'} bg={`${scheme}.400`} />
              <Text
                fontSize={'13px'}
                fontWeight={'bold'}
                letterSpacing={'0.08em'}
                textTransform={'uppercase'}
                color={'uspolis.textMuted'}
              >
                {`${ReservationStatus.translate(section.status)}s`}
              </Text>
              <Text fontSize={'13px'} color={'uspolis.textMuted'}>
                {section.items.length}
              </Text>
              <Divider borderColor={'uspolis.border'} flex={1} minW={'8px'} />
            </HStack>

            <VStack align={'stretch'} spacing={'10px'}>
              {section.items.map((solicitation) => (
                <MySolicitationCard
                  key={solicitation.id}
                  solicitation={solicitation}
                  selected={solicitation.id === selectedId}
                  onClick={() => onSelect(solicitation)}
                  onEditClick={onEditClick}
                  onCancelClick={onCancelClick}
                />
              ))}
            </VStack>
          </VStack>
        );
      })}
    </VStack>
  );
}

export default MySolicitationList;
