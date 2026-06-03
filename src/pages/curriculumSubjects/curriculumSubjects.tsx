import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Progress,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';

import { useEffect, useMemo, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';

import PageContent from '../../components/common/PageContent';
import Dialog from '../../components/common/Dialog/dialog.component';

import useCurriculumSubjectsService from '../../hooks/API/services/useCurriculumSubjectsService';
import { CurriculumSubjectResponse } from '../../models/http/responses/curriculumSubject.response.models';
import CurriculumSubjectModal from './CurriculumSubjectModal/curriculumSubject.modal';
import { useLocation, useParams } from 'react-router-dom';
import { SubjectResponseBase } from '../../models/http/responses/subject.response.models';
import useSubjectsService from '../../hooks/API/services/useSubjectsService';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import useCustomToast from '../../hooks/useCustomToast';
import MissingSubjectsFloatingWindow from '../../components/common/FloatingWindow/floatingWindow.component';

function CurriculumSubjects() {
  const showToast = useCustomToast();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const { curriculumId } = useParams();

  const location = useLocation() as {
    state?: {
      curriculum?: any;
      course?: any;
      missingSubjects?: {
        subject_code: string;
        subject_name: string;
        period: number;
      }[];
      showMissingWindow?: boolean;
    };
  };

  const course = location.state?.course;

  const [showMissingWindow, setShowMissingWindow] =
    useState(
      location.state?.showMissingWindow ?? false,
    );

  const [missingSubjects] = useState(
    location.state?.missingSubjects ?? [],
  );

  const [selectedItem, setSelectedItem] = useState<CurriculumSubjectResponse>();

  const [isUpdate, setIsUpdate] = useState(false);

  const { getByCurriculumId, deleteById } = useCurriculumSubjectsService();

  const [data, setData] = useState<CurriculumSubjectResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState<SubjectResponseBase[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const { getCore: getAllSubjects } = useSubjectsService();

  const [selectedPeriod, setSelectedPeriod] = useState<number | undefined>();

  useEffect(() => {
    async function fetchSubjects() {
      const res = await getAllSubjects();
      setSubjects(res.data);
    }

    try {
      setLoadingSubjects(true);
      fetchSubjects();
    } catch (error) {
      console.error('Erro ao carregar disciplinas: ', error);
      showToast(
        'Erro',
        'Não foi possível carregar as disciplinas.',
        'error',
      );
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subjectMap = useMemo(() => {
    return Object.fromEntries(
      subjects.map((s) => [s.id, `${s.code} - ${s.name}`]),
    );
  }, [subjects]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await getByCurriculumId(Number(curriculumId));
      setData(res.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas do currículo: ', error);
      showToast(
        'Erro',
        'Não foi possível carregar as disciplinas do currículo.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refetch() {
    fetchData();
  }

  function handleModalClose() {
    onCloseModal();

    setSelectedItem(undefined);

    setIsUpdate(false);

    setSelectedPeriod(undefined);
  }

  async function handleSuccess(
    action: 'create' | 'update',
    ) {
      await fetchData();

      showToast(
        'Sucesso',
        action === 'create'
          ? 'Disciplina adicionada ao currículo.'
          : 'Disciplina editada com sucesso.',
        'success',
      );
    }

  function handleCreateClick(period: number) {
    setSelectedItem(undefined);
    setIsUpdate(false);
    setSelectedPeriod(period);
    onOpenModal();
  }

  function handleEditClick(item: CurriculumSubjectResponse) {
    setSelectedItem(item);
    setIsUpdate(true);
    setSelectedPeriod(undefined);
    onOpenModal();
  }

  function handleDeleteClick(item: CurriculumSubjectResponse) {
    setSelectedItem(item);
    onOpenDelete();
  }

  async function handleDelete() {
    if (!selectedItem) return;

    try {
      await deleteById(
        selectedItem.id,
      );

      showToast(
        'Sucesso',
        'Disciplina removida do currículo.',
        'success',
      );

      onCloseDelete();

      refetch();
    } catch (error) {
      console.error(
        'Erro ao deletar disciplina do currículo: ',
        error,
      );

      showToast(
        'Erro',
        'Não foi possível deletar a disciplina do currículo.',
        'error',
      );
    }
  }

  const groupedByPeriod = useMemo(() => {
    const grouped: Record<number, CurriculumSubjectResponse[]> = {};
    for (const item of data) {
      if (!grouped[item.period]) grouped[item.period] = [];
      grouped[item.period].push(item);
    }

    return grouped;
  }, [data]);

  const periods = useMemo(() => {
    if (!course?.ideal_duration) return [];
    return Array.from({ length: course.ideal_duration }, (_, i) => i + 1);
  }, [course]);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'mandatory':
        return 'green';
      case 'free_elective':
        return 'green';
      case 'track_elective':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <PageContent>
      <CurriculumSubjectModal
        isOpen={isOpenModal}
        onClose={handleModalClose}
        isUpdate={isUpdate}
        selectedItem={selectedItem}
        refetch={async () => {
          await handleSuccess(
            isUpdate
              ? 'update'
              : 'create',
          );
        }}
        course={course}
        defaultPeriod={selectedPeriod}
      />

      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja remover este item?`}
        warningText='Essa ação é irreversível.'
      />

      <Box
        w='100%'
        maxW='1600px'
        mx='auto'
        px={{
          base: 2,
          md: 6,
          lg: 10,
        }}
      >
        <Text fontSize='4xl'>{course?.name} - Disciplinas</Text>
        <Text mb={4}>
          Gerencie as disciplinas do currículo, organizadas por períodos. Você
          pode adicionar, editar ou remover disciplinas.
        </Text>

        <Skeleton isLoaded={!loading || !loadingSubjects}>
          <Accordion allowToggle defaultIndex={[0]}>
            {periods.map((period) => (
              <AccordionItem key={period}>
                <AccordionButton>
                  <Box flex='1' textAlign='left' fontWeight='bold'>
                    {period}° período
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel>
                  <Flex mb={3} align='center'>
                    <Spacer />

                    <Button
                      colorScheme='blue'
                      size='sm'
                      rightIcon={<AddIcon />}
                      onClick={() => handleCreateClick(period)}
                    >
                      Cadastrar disciplina
                    </Button>
                  </Flex>

                  <Box w='100%'>
                    {(groupedByPeriod[period] ?? []).length > 0 && (
                      <Box
                        border='1px'
                        borderRadius='lg'
                        borderColor='uspolis.blue'
                        overflowX='auto'
                        w='100%'
                      >
                        {loading && <Progress size='xs' isIndeterminate />}

                        <Table 
                          variant='simple'
                          w='100%'
                          sx={{
                            tableLayout: 'fixed',
                          }}>
                          <Thead>
                            <Tr>
                              <Th color='uspolis.blue'>Disciplina</Th>
                              <Th color='uspolis.blue'>Tipo</Th>
                              <Th color='uspolis.blue'>Categoria</Th>
                              <Th color='uspolis.blue' textAlign='right'>
                                Opções
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {(groupedByPeriod[period] ?? []).map((item) => {
                              const typeMap: Record<string, string> = {
                                SEMESTRAL: 'Semestral',
                                QUADRIMESTER: 'Quadrimestral',
                              };

                              const categoryMap: Record<string, string> = {
                                mandatory: 'Obrigatória',
                                free_elective: 'Optativa Livre',
                                track_elective: 'Optativa Eletiva',
                              };

                              return (
                                <Tr key={item.id}>
                                  <Td
                                    maxW='0'
                                    overflow='hidden'
                                    whiteSpace='normal'
                                    wordBreak='break-word'
                                  >{subjectMap[item.subject_id] ?? '-'}</Td>
                                  <Td>
                                    <Badge>
                                      {typeMap[item.type] ?? item.type}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Badge
                                      colorScheme={getCategoryBadgeColor(
                                        item.category,
                                      )}
                                    >
                                      {categoryMap[item.category] ??
                                        item.category}
                                    </Badge>
                                  </Td>

                                  <Td>
                                    <HStack
                                      spacing='0px'
                                      justifyContent='flex-end'
                                    >
                                      <Tooltip label='Editar'>
                                        <IconButton
                                          colorScheme='yellow'
                                          size='xs'
                                          variant='ghost'
                                          aria-label='editar'
                                          icon={<BsFillPenFill />}
                                          onClick={() => handleEditClick(item)}
                                        />
                                      </Tooltip>

                                      <Tooltip label='Remover'>
                                        <IconButton
                                          colorScheme='red'
                                          size='xs'
                                          variant='ghost'
                                          aria-label='remover'
                                          icon={<BsFillTrashFill />}
                                          onClick={() =>
                                            handleDeleteClick(item)
                                          }
                                        />
                                      </Tooltip>
                                    </HStack>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Skeleton>
      </Box>
      {showMissingWindow &&
        missingSubjects.length > 0 && (
          <MissingSubjectsFloatingWindow
            subjects={missingSubjects}
            onClose={() =>
              setShowMissingWindow(false)
            }
          />
      )}
    </PageContent>
  );
}

export default CurriculumSubjects;