import { useEffect, useState } from 'react';
import * as C from '@chakra-ui/react';
import Conflict from '../../models/http/responses/conflict.response.models';
import moment from 'moment';
import PageContent from '../../components/common/PageContent';
import { AllocateClassModal } from '../../pages/classes/AllocateClassModal';
import { Collapsable } from '../../components/common/Collapsable';
import useConflictsService from '../../hooks/API/services/useConflictsService';
import useCustomToast from '../../hooks/useCustomToast';
import Select from 'react-select';

type Option = {
  value: string;
  label: string;
};

const ConflictsPage = () => {
  const showToast = useCustomToast();

  const conflictsService = useConflictsService();

  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buildingNames, setBuildingNames] = useState<string[] | null>(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>('');
  const [isOpenAllocate, setIsOpenAllocate] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number>(0);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBuildingNames(conflicts?.map((it) => it.name) || []);
  }, [conflicts]);

  function fetchData() {
    setLoading(true);
    conflictsService
      .list()
      .then((res) => {
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        showToast('Erro', 'Erro ao carregar conflitos', 'error');
      })
      .finally(() => {
        setLoading(false);
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
            <Select
              placeholder={'Selecione o prédio'}
              options={
                buildingNames
                  ? buildingNames.map((it) => ({ value: it, label: it }))
                  : []
              }
              onChange={(e: Option | null) => {
                if (e) setSelectedBuildingName(e.value);
                else setSelectedBuildingName('');
              }}
              isLoading={loading}
            />
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
                                            {event.subject_code}
                                          </C.Text>
                                        ) : undefined}
                                        {event.reservation_title ? (
                                          <C.Text fontSize={'md'}>
                                            Reserva: {event.reservation_title}
                                          </C.Text>
                                        ) : undefined}
                                      </C.Flex>
                                      <C.Flex direction={'column'} flex={1}>
                                        {event.class_code ? (
                                          <C.Text fontSize={'md'}>
                                            Turma: {event.class_code}
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
