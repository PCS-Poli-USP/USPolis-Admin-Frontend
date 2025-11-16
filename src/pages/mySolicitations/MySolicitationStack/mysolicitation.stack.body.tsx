import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Highlight,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import {
  getRequesterText,
  getSolicitationStatusText,
} from '../../../utils/solicitations/solicitation.formatter';

interface SolicitationStackBodyProps {
  solicitations: SolicitationResponse[];
  handleOnClick: (data: SolicitationResponse) => void;
  reset: () => void;
}

function SolicitationStackBody({
  solicitations,
  handleOnClick,
  reset,
}: SolicitationStackBodyProps) {
  return (
    <VStack w={'full'}>
      {solicitations.length > 0 ? (
        solicitations.map((solicitation, index) => {
          const pending = solicitation.status === ReservationStatus.PENDING;

          return (
            <Box
              key={index}
              w={'full'}
              borderRadius='md'
              borderWidth={'1px'}
              borderColor={'gray.200'}
              p={2}
              cursor={false ? 'not-allowed' : 'pointer'}
              transition='background 0.3s, opacity 0.3s'
              opacity={pending ? 1 : 0.6}
              _hover={false ? {} : { bg: 'gray.100', opacity: 0.8 }}
              _active={!pending ? {} : { bg: 'gray.300', opacity: 0.6 }}
              onClick={() => {
                reset();
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
                <Highlight
                  query={['solicitante:', solicitation.user]}
                  styles={{ textColor: 'uspolis.text', fontWeight: 'bold' }}
                >
                  {getRequesterText(solicitation)}
                </Highlight>
              </Text>

              <Text>
                <Highlight
                  query={[
                    'pendente',
                    'aprovado',
                    'negado',
                    'cancelada',
                    'removida',
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
        <Alert status='success'>
          <AlertIcon />
          Nenhuma solicitação pendente
        </Alert>
      )}
    </VStack>
  );
}

export default SolicitationStackBody;
