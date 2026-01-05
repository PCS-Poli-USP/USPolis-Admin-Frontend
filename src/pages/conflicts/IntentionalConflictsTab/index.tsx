import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import Conflict from '../../../models/http/responses/conflict.response.models';
import moment from 'moment';
import { Collapsable } from '../../../components/common/Collapsable';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { useLocation, useNavigate } from 'react-router-dom';

interface IntentionalConflictsTabProps {
  conflictSpec: Conflict | null;
  setSelectedClassId: (classId: number) => void;
  setIsOpenAllocate: (isOpen: boolean) => void;
}

function IntentionalConflictsTab({
  conflictSpec,
  setSelectedClassId,
  setIsOpenAllocate,
}: IntentionalConflictsTabProps) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Flex direction={'column'}>
      <Accordion allowToggle>
        {conflictSpec ? (
          conflictSpec.conflicts.map((classroom, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left' fontWeight={'bold'}>
                    Sala: {classroom.name} [
                    {classroom.total_classroom_conflicts} datas]
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel display='flex' flexDirection='column' gap={4}>
                {Object.entries(classroom.conflicts).map(
                  ([identifier, event_groups], index) => (
                    <Flex
                      key={index}
                      direction={'column'}
                      justifyContent={'space-between'}
                      gap={4}
                      border={'1px solid'}
                      boxShadow={'md'}
                      borderColor={'gray.200'}
                      borderRadius={4}
                      padding={4}
                    >
                      <Collapsable title={identifier}>
                        {event_groups.map((event_group, index) => (
                          <Flex
                            key={index}
                            direction={'column'}
                            justifyContent={'space-between'}
                            border={'1px solid'}
                            borderColor={'gray.200'}
                            borderRadius={4}
                            padding={4}
                            margin={4}
                          >
                            <Heading size='md'>
                              {moment(event_group[0].date).format('DD/MM/YYYY')}
                            </Heading>
                            {event_group.map((event) => (
                              <Flex
                                key={event.id}
                                direction={'row'}
                                justifyContent={'space-between'}
                                border={'1px solid'}
                                borderColor={'gray.200'}
                                borderRadius={4}
                                padding={4}
                              >
                                <Flex direction={'column'} flex={1}>
                                  <Text fontSize={'md'}>
                                    <strong>
                                      Início:{' '}
                                      {event.start_time.toLocaleString()}
                                    </strong>
                                  </Text>
                                  <Text fontSize={'md'}>
                                    <strong>
                                      Fim: {event.end_time.toLocaleString()}
                                    </strong>
                                  </Text>
                                </Flex>
                                <Flex direction={'column'} flex={1}>
                                  {event.subject_code ? (
                                    <Text fontSize={'md'}>
                                      {event.subject_code}
                                    </Text>
                                  ) : undefined}
                                  {event.reservation_title ? (
                                    <Text fontSize={'md'}>
                                      Reserva: {event.reservation_title}
                                    </Text>
                                  ) : undefined}
                                </Flex>
                                <Flex direction={'column'} flex={1}>
                                  {event.class_code ? (
                                    <Text fontSize={'md'}>
                                      Turma:{' '}
                                      {classNumberFromClassCode(
                                        event.class_code,
                                      )}
                                    </Text>
                                  ) : undefined}
                                </Flex>
                                <Button
                                  hidden={!event.class_id}
                                  onClick={() => {
                                    setSelectedClassId(event.class_id);
                                    setIsOpenAllocate(true);
                                  }}
                                >
                                  Editar Alocação
                                </Button>
                                {!event.class_id && (
                                  <Button
                                    onClick={() => {
                                      navigate('/reservations', {
                                        state: { from: location.pathname },
                                      });
                                    }}
                                  >
                                    Ir para Reservas
                                  </Button>
                                )}
                              </Flex>
                            ))}
                          </Flex>
                        ))}
                      </Collapsable>
                    </Flex>
                  ),
                )}
              </AccordionPanel>
            </AccordionItem>
          ))
        ) : (
          <></>
        )}
      </Accordion>
      {conflictSpec ? (
        conflictSpec.conflicts.length === 0 ? (
          <Alert status='success' borderRadius={'10px'} w={'435px'}>
            <AlertIcon />
            <AlertTitle>Nenhum conflito encontrado</AlertTitle>
          </Alert>
        ) : undefined
      ) : (
        <Alert status='warning' borderRadius={'10px'} w={'435px'}>
          <AlertIcon />
          <AlertTitle>Selecione um prédio</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
}

export default IntentionalConflictsTab;
