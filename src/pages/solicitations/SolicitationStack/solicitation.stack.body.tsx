import {
  Alert,
  AlertIcon,
  Box,
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
  selectedIndex?: number;
  setSelectedIndex: (index: number) => void;
}

function SolicitationStackBody({
  solicitations,
  handleOnClick,
  reset,
  selectedIndex,
  setSelectedIndex,
}: SolicitationStackBodyProps) {
  return (
    <VStack w={'full'} divider={<StackDivider />}>
      {solicitations.length > 0 ? (
        solicitations.map((solicitation, index) => {
          const selected = selectedIndex === index;
          const closed = solicitation.status !== ReservationStatus.PENDING;
          return (
            <Box
              key={index}
              w={'full'}
              borderRadius='md'
              p={'10px'}
              border={selected ? '1px' : undefined}
              cursor={false ? 'not-allowed' : 'pointer'}
              transition='background 0.3s, opacity 0.3s'
              opacity={closed && !selected ? 0.6 : 1}
              _hover={false ? {} : { bg: 'gray.100', opacity: 0.8 }}
              _active={
                closed && !selected ? {} : { bg: 'gray.300', opacity: 0.6 }
              }
              onClick={() => {
                reset();
                setSelectedIndex(index);
                handleOnClick(solicitation);
              }}
            >
              <Heading size={'md'}>{`Reserva de Sala`}</Heading>
              <Text>{`Local: ${solicitation.building}, sala ${
                solicitation.reservation.classroom
                  ? solicitation.reservation.classroom
                  : 'não especificada'
              }`}</Text>
              {/* <Spacer /> */}
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
                  styles={{ textColor: 'uspolis.blue', fontWeight: 'bold' }}
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
