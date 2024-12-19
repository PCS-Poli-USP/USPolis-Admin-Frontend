import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Highlight,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';

interface SolicitationStackBodyProps {
  solicitations: ClassroomSolicitationResponse[];
  handleOnClick: (data: ClassroomSolicitationResponse) => void;
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
        solicitations.map((solicitation, index) => (
          <Box
            key={index}
            w={'full'}
            borderRadius='md'
            borderWidth={'1px'}
            borderColor={'gray.200'}
            p={2}
            cursor={false ? 'not-allowed' : 'pointer'}
            transition='background 0.3s, opacity 0.3s'
            opacity={solicitation.closed ? 0.6 : 1}
            _hover={false ? {} : { bg: 'gray.100', opacity: 0.8 }}
            _active={
              solicitation.closed ? {} : { bg: 'gray.300', opacity: 0.6 }
            }
            onClick={() => {
              reset();
              handleOnClick(solicitation);
            }}
          >
            <Heading size={'md'}>{`Reserva de Sala`}</Heading>
            {/* <VStack w={'full'} spacing={0}> */}
            <Text>{`Local: ${solicitation.building}, sala ${
              solicitation.classroom
                ? solicitation.classroom
                : 'não especificada'
            }`}</Text>
            {/* <Spacer /> */}
            <Text>
              <Text
                as={'span'}
              >{`${`Solicitante: ${solicitation.user}`}`}</Text>
              {` às ${
                solicitation.approved || solicitation.denied
                  ? moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')
                  : moment(solicitation.created_at).format('DD/MM/YYYY, HH:mm')
              }`}
            </Text>
            {solicitation.approved || solicitation.denied ? (
              <Text>
                <Highlight
                  query={['aprovado', 'negado', solicitation.user]}
                  styles={{ textColor: 'uspolis.blue', fontWeight: 'bold' }}
                >
                  {`${
                    solicitation.approved
                      ? `Situação: Aprovado por ${solicitation.closed_by}`
                      : solicitation.denied
                      ? `Situação: Negado por ${solicitation.closed_by}`
                      : ''
                  } às ${moment(solicitation.updated_at).format(
                    'DD/MM/YYYY, HH:mm',
                  )}`}
                </Highlight>
              </Text>
            ) : (
              <Text>
                <Highlight
                  query={'pendente'}
                  styles={{ textColor: 'uspolis.blue', fontWeight: 'bold' }}
                >
                  Situação: Pendente
                </Highlight>
              </Text>
            )}
          </Box>
        ))
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
