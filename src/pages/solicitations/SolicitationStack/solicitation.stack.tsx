import {
  Alert,
  AlertIcon,
  Box,
  Checkbox,
  Heading,
  HStack,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface SolicitationStackProps {
  solicitations: ClassroomSolicitationResponse[];
  handleOnClick: (data: ClassroomSolicitationResponse) => void;
}

function SolicitationStack({
  solicitations,
  handleOnClick,
}: SolicitationStackProps) {
  const [hidden, setHidden] = useState(true);
  const [current, setCurrent] = useState<ClassroomSolicitationResponse[]>([]);
  useEffect(() => {
    if (hidden) {
      setCurrent([
        ...solicitations.filter((solicitation) => !solicitation.closed),
      ]);
    } else setCurrent([...solicitations]);
  }, [hidden, setCurrent, solicitations]);

  return (
    <VStack
      divider={<StackDivider border={'1px solid lightgray'} />}
      alignItems={'flex-start'}
      alignContent={'flex-start'}
      w={'full'}
      spacing={2}
      paddingRight={5}
    >
      <Heading w={'full'} fontWeight={'bold'} textAlign={'center'}>
        Solicitações
      </Heading>
      <HStack>
        <Checkbox
          isChecked={hidden}
          onChange={() => {
            setHidden((prev) => !prev);
          }}
        >
          Ocultar aprovados/negados
        </Checkbox>
      </HStack>
      {current.length > 0 ? (
        current.map((solicitation, index) => (
          <Box
            key={index}
            w={'full'}
            borderRadius='md'
            cursor={false ? 'not-allowed' : 'pointer'}
            transition='background 0.3s, opacity 0.3s'
            opacity={solicitation.closed ? 0.6 : 1}
            _hover={false ? {} : { bg: 'gray.100', opacity: 0.8 }}
            _active={
              solicitation.closed ? {} : { bg: 'gray.300', opacity: 0.6 }
            }
            onClick={() => {
              handleOnClick(solicitation);
            }}
          >
            <Heading size={'md'}>{`Reserva de Sala - ${
              solicitation.classroom
                ? solicitation.classroom
                : 'Não especificada'
            }`}</Heading>
            <HStack w={'full'}>
              <Text>{`Prédio - ${solicitation.building}`}</Text>
              <Spacer />
              <Text>
                <Text as={'span'} fontWeight={'bold'}>{`${
                  solicitation.approved
                    ? 'Aprovado'
                    : solicitation.denied
                    ? 'Negado'
                    : 'Solicitado'
                }`}</Text>
                {` às ${
                  solicitation.approved || solicitation.denied
                    ? moment(solicitation.updated_at).format(
                        'DD/MM/YYYY, HH:mm',
                      )
                    : moment(solicitation.created_at).format(
                        'DD/MM/YYYY, HH:mm',
                      )
                }`}
              </Text>
            </HStack>
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

export default SolicitationStack;
