import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Highlight,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import moment from 'moment';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import { getSolicitationStatusText } from '../../../utils/solicitations/solicitation.formatter';

interface SolicitationStackBodyProps {
  solicitations: SolicitationResponse[];
  handleOnClick: (data: SolicitationResponse) => void;
  reset: () => void;
  selectedSolicitation?: SolicitationResponse;
  selectedIndex?: number;
  setSelectedIndex: (index: number) => void;
  showAll: boolean;
  totalItems: number;
  hasMore: boolean;
  handleShowMoreClick: (target: HTMLButtonElement) => Promise<void>;
}

function SolicitationStackBody({
  solicitations,
  handleOnClick,
  reset,
  selectedSolicitation,
  setSelectedIndex,
  showAll,
  hasMore,
  handleShowMoreClick,
}: SolicitationStackBodyProps) {
  return (
    <VStack w={'full'} divider={<StackDivider />}>
      {showAll && hasMore && (
        <Button
          w={'full'}
          onClick={(event) => handleShowMoreClick(event.currentTarget)}
        >
          Ver mais
        </Button>
      )}

      {solicitations.length > 0 ? (
        solicitations.map((_, index) => {
          const solicitation = solicitations[solicitations.length - 1 - index];
          const selected =
            selectedSolicitation && selectedSolicitation.id == solicitation.id;
          const closed = solicitation.status !== ReservationStatus.PENDING;
          return (
            <Box
              key={index}
              w={'full'}
              borderRadius='md'
              p={'10px'}
              border={selected ? '1px' : undefined}
              cursor={'pointer'}
              transition='background 0.3s, opacity 0.3s'
              opacity={closed && !selected ? 0.6 : 1}
              _hover={{
                bg: 'uspolis.lightGray',
                opacity: 0.8,
              }}
              _active={
                closed && !selected
                  ? {}
                  : {
                      bg: 'uspolis.lightGray',
                      opacity: 0.6,
                    }
              }
              onClick={() => {
                reset();
                setSelectedIndex(index);
                handleOnClick(solicitation);
              }}
            >
              <Heading size={'md'}>{`Reserva de Sala`}</Heading>
              <Text>{`Local: ${solicitation.building}, sala ${
                solicitation.reservation.classroom_name
                  ? solicitation.reservation.classroom_name
                  : 'não especificada'
              }`}</Text>
              <Text>
                <Text
                  as={'span'}
                >{`${`Solicitante: ${solicitation.user}`}`}</Text>
                {` às ${moment(solicitation.created_at).format(
                  'DD/MM/YYYY, HH:mm',
                )}`}
              </Text>

              <Text>
                <Highlight
                  query={[
                    'aprovado',
                    'negado',
                    'removida',
                    'pendente',
                    'cancelada',
                    solicitation.user,
                  ]}
                  styles={{
                    textColor: ReservationStatus.getColor(solicitation.status),
                    fontWeight: 'bold',
                  }}
                >
                  {getSolicitationStatusText(solicitation)}
                </Highlight>
              </Text>
            </Box>
          );
        })
      ) : (
        <Alert status='success' borderRadius={'10px'}>
          <AlertIcon />
          Nenhuma solicitação pendente
        </Alert>
      )}
    </VStack>
  );
}

export default SolicitationStackBody;
