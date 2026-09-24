import { Button, Grid, Text, VStack } from '@chakra-ui/react';

import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import SolicitationCard from './SolicitationCard/solicitation.card';

interface SolicitationStackBodyProps {
  solicitations: SolicitationResponse[];
  onSelect: (data: SolicitationResponse) => void;
  emptyText: string;
  hasMore: boolean;
  handleShowMoreClick: () => Promise<void>;
}

function SolicitationStackBody({
  solicitations,
  onSelect,
  emptyText,
  hasMore,
  handleShowMoreClick,
}: SolicitationStackBodyProps) {
  if (solicitations.length === 0) {
    return (
      <VStack
        spacing={'8px'}
        p={{ base: '36px 18px', md: '48px 24px' }}
        border={'1px dashed'}
        borderColor={'uspolis.border'}
        borderRadius={'12px'}
        bg={'uspolis.white'}
        textAlign={'center'}
      >
        <Text fontSize={'15px'} color={'uspolis.textMuted'}>
          {emptyText}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align={'stretch'} spacing={'14px'} w={'full'}>
      <Grid
        templateColumns={'repeat(auto-fill, minmax(min(100%, 360px), 1fr))'}
        gap={'12px'}
      >
        {solicitations.map((solicitation) => (
          <SolicitationCard
            key={solicitation.id}
            solicitation={solicitation}
            onClick={() => onSelect(solicitation)}
          />
        ))}
      </Grid>
      {hasMore && (
        <Button
          alignSelf={'center'}
          bg={'uspolis.surfaceSubtle'}
          color={'uspolis.text'}
          fontWeight={'semibold'}
          _hover={{ filter: 'brightness(0.95)' }}
          onClick={() => handleShowMoreClick()}
        >
          Ver mais
        </Button>
      )}
    </VStack>
  );
}

export default SolicitationStackBody;
