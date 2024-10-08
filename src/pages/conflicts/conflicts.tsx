import { useEffect, useState } from 'react';
import ConflictsService from '../../services/api/conflicts.service';
import * as C from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Conflict from 'models/http/responses/conflict.response.models';
import EventsService from 'services/api/events.service';
import moment from 'moment';
import PageContent from 'components/common/PageContent';
import { AllocateClassModal } from 'pages/classes/AllocateClassModal';
import { Collapsable } from 'components/common/Collapsable';
const ConflictsPage = () => {
  const eventsService = new EventsService();
  const conflictsService = new ConflictsService();

  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);
  const [buildingNames, setBuildingNames] = useState<string[] | null>(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>('');
  const [isOpenAllocate, setIsOpenAllocate] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number>(0);

  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBuildingNames(conflicts?.map((it) => it.name) || []);
  }, [conflicts]);

  function fetchData() {
    conflictsService
      .list()
      .then((res) => {
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar conflitos');
      });
  }

  useEffect(() => {
    console.log(conflicts);
  }, [conflicts]);

  function handleAllocationEdit(
    events_ids: string[],
    newClassroom: string,
    building_id: number,
  ) {
    eventsService
      .editManyAllocations({
        events_ids,
        building_id,
        classroom: newClassroom,
      })
      .then(() => {
        toastSuccess('Alocação editada com sucesso!');
        fetchData();
      })
      .catch((error) => {
        toastError(`Erro ao editar alocação: ${error}`);
      });
  }

  function handleAllocationDelete(subjectCode: string, classCode: string) {
    eventsService
      .deleteClassAllocation(subjectCode, classCode)
      .then((it) => {
        toastSuccess(
          `Alocação de ${subjectCode} - ${classCode}  deletada com sucesso!`,
        );
      })
      .catch((error) => {
        toastError(
          `Erro ao deletar alocação de ${subjectCode} - ${classCode}: ${error}`,
        );
      });
  }

  return (
    <PageContent>
      <C.Flex paddingX={4} direction={'column'}>
        <C.Text fontSize='4xl' mb={4}>
          Conflitos
        </C.Text>
        <C.Flex direction={'row'} gap={4} mb={4}>
          <C.Flex direction={'column'} flex={1}>
            <C.Text fontSize={'md'}>Prédio:</C.Text>
            <C.Select
              placeholder='Selecione o prédio'
              onChange={(e) => setSelectedBuildingName(e.target.value)}
            >
              {buildingNames?.map((buildingName) => (
                <option key={buildingName} value={buildingName}>
                  {buildingName}
                </option>
              ))}
            </C.Select>
          </C.Flex>
        </C.Flex>
        <C.Flex direction={'column'}>
          <C.Accordion allowToggle>
            {selectedBuildingName ? (
              conflicts
                ?.find((it) => it.name === selectedBuildingName)
                ?.conflicts.map((classroom) => (
                  <C.AccordionItem>
                    <h2>
                      <C.AccordionButton>
                        <C.Box flex='1' textAlign='left' fontWeight={'bold'}>
                          Sala: {classroom.name}
                        </C.Box>
                        <C.AccordionIcon />
                      </C.AccordionButton>
                    </h2>
                    <C.AccordionPanel
                      display='flex'
                      flexDirection='column'
                      gap={4}
                    >
                      {Object.entries(classroom.conflicts).map(
                        ([identifier, event_groups], index) => (
                          <C.Flex
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
                                <C.Flex
                                  key={index}
                                  direction={'column'}
                                  justifyContent={'space-between'}
                                  border={'1px solid'}
                                  borderColor={'gray.200'}
                                  borderRadius={4}
                                  padding={4}
                                  margin={4}
                                >
                                  <C.Heading size='md'>
                                    {moment(event_group[0].date).format(
                                      'DD/MM/YYYY',
                                    )}
                                  </C.Heading>
                                  {event_group.map((event) => (
                                    <C.Flex
                                      key={event.id}
                                      direction={'row'}
                                      justifyContent={'space-between'}
                                      border={'1px solid'}
                                      borderColor={'gray.200'}
                                      borderRadius={4}
                                      padding={4}
                                    >
                                      <C.Flex direction={'column'} flex={1}>
                                        <C.Text fontSize={'md'}>
                                          <strong>
                                            Início:{' '}
                                            {event.start_time.toLocaleString()}
                                          </strong>
                                        </C.Text>
                                        <C.Text fontSize={'md'}>
                                          <strong>
                                            Fim:{' '}
                                            {event.end_time.toLocaleString()}
                                          </strong>
                                        </C.Text>
                                      </C.Flex>
                                      <C.Flex direction={'column'} flex={1}>
                                        {event.subject_code ? (
                                          <C.Text fontSize={'md'}>
                                            Disciplina: {event.subject_code}
                                          </C.Text>
                                        ) : undefined}
                                        {event.reservation_name ? (
                                          <C.Text fontSize={'md'}>
                                            Reserva: {event.reservation_name}
                                          </C.Text>
                                        ) : undefined}
                                      </C.Flex>
                                      <C.Flex direction={'column'} flex={1}>
                                        {event.class_code ? (
                                          <C.Text fontSize={'md'}>
                                            Código de turma: {event.class_code}
                                          </C.Text>
                                        ) : undefined}

                                        {event.subject_code ? (
                                          <C.Text fontSize={'md'}>
                                            Código de disciplina:{' '}
                                            {event.subject_code}
                                          </C.Text>
                                        ) : undefined}
                                      </C.Flex>
                                      <C.Button
                                        onClick={() => {
                                          setSelectedClassId(event.class_id);
                                          setIsOpenAllocate(true);
                                        }}
                                      >
                                        Editar Alocação
                                      </C.Button>
                                    </C.Flex>
                                  ))}
                                </C.Flex>
                              ))}
                            </Collapsable>
                          </C.Flex>
                        ),
                      )}
                    </C.AccordionPanel>
                  </C.AccordionItem>
                ))
            ) : (
              <></>
            )}
          </C.Accordion>
          {selectedBuildingName ? (
            conflicts?.find((val) => val.name === selectedBuildingName)
              ?.conflicts.length === 0 ? (
              <C.Alert status='success'>
                <C.AlertIcon />
                <C.AlertTitle>Nenhum conflito encontrado</C.AlertTitle>
              </C.Alert>
            ) : undefined
          ) : (
            <C.Alert status='warning'>
              <C.AlertIcon />
              <C.AlertTitle>Selecione um prédio</C.AlertTitle>
            </C.Alert>
          )}
        </C.Flex>
      </C.Flex>
      <AllocateClassModal
        isOpen={isOpenAllocate}
        onClose={() => {
          setIsOpenAllocate(false);
          fetchData();
        }}
        class_id={selectedClassId}
      />
    </PageContent>
  );
};

export default ConflictsPage;
