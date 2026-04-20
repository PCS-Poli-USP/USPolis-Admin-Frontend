import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  IconButton,
  Progress,
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
import DataTable from '../../components/common/DataTable/dataTable.component';
import Dialog from '../../components/common/Dialog/dialog.component';

import useCurriculumSubjectsService from '../../hooks/API/services/useCurriculumSubjectsService';
import { CurriculumSubjectResponse } from '../../models/http/responses/curriculumSubject.response.models';
import CurriculumSubjectModal from './CurriculumSubjectModal/curriculumSubject.modal';
import { getCurriculumSubjectColumns } from './Tables/curriculumSubjects.table';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubjectResponse } from '../../models/http/responses/subject.response.models';
import useSubjectsService from '../../hooks/API/services/useSubjectsService';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

function CurriculumSubjects() {
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
    };
  };

  const navigate = useNavigate();

  const curriculum = location.state?.curriculum;
  const course = location.state?.course;

  const [selectedItem, setSelectedItem] =
    useState<CurriculumSubjectResponse>();

  const [isUpdate, setIsUpdate] = useState(false);

  const { getByCurriculumId, deleteById } = useCurriculumSubjectsService();

  const [data, setData] = useState<CurriculumSubjectResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const { get: getAllSubjects } = useSubjectsService();

  const [selectedPeriod, setSelectedPeriod] = useState<number | undefined>();

  useEffect(() => {
    async function fetchSubjects() {
      const res = await getAllSubjects();
      setSubjects(res.data);
    }

    fetchSubjects();
  }, []);

  const subjectMap = useMemo(() => {
    return Object.fromEntries(
      subjects.map((s) => [s.id, `${s.code} - ${s.name}`])
    );
  }, [subjects]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await getByCurriculumId(Number(curriculumId));
      setData(res.data);
    } catch {
      console.error('Erro ao carregar disciplinas do currículo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function refetch() {
    fetchData();
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
    if (selectedItem) {
      await deleteById(selectedItem.id);
    }
    onCloseDelete();
    refetch();
  }

  const periods = useMemo(() => {
    if (!course?.ideal_duration) return [];
    return Array.from({ length: course.ideal_duration }, (_, i) => i + 1);
  }, [course]);

  const groupedByPeriod = useMemo(() => {
    const grouped: Record<number, CurriculumSubjectResponse[]> = {};

    for (const item of data) {
      if (!grouped[item.period]) grouped[item.period] = [];
      grouped[item.period].push(item);
    }

    return grouped;
  }, [data]);

  return (
    <PageContent>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/courses')}>
            Cursos
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() =>
              navigate(`/courses/${course?.id}/curriculums`, {
                state: { course },
              })
            }
          >
            {course?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            {curriculum?.description} - Disciplinas
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <CurriculumSubjectModal
        isOpen={isOpenModal}
        onClose={() => {
          onCloseModal();
          setSelectedItem(undefined);
          setIsUpdate(false);
          setSelectedPeriod(undefined);
        }}
        isUpdate={isUpdate}
        selectedItem={selectedItem}
        refetch={refetch}
        course={course}
        defaultPeriod={selectedPeriod}
      />

      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={`Deseja remover este item?`}
        warningText="Essa ação é irreversível."
      />

      <Box w="100%">
        <Text fontSize="4xl" mb={4}>
          Disciplinas
        </Text>

        <Accordion allowMultiple>
          {periods.map((period) => (
            <AccordionItem key={period}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {period}° período
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <Flex mb={3} align="center">

                  <Spacer />

                  <Button
                    colorScheme="blue"
                    size="sm"
                    rightIcon={<AddIcon />}
                    onClick={() => handleCreateClick(period)}
                  >
                    Cadastrar disciplina
                  </Button>
                </Flex>

                <Box w="100%">
                  <TableContainer border="1px" borderRadius="lg" borderColor="uspolis.blue">
                    {loading && <Progress size="xs" isIndeterminate />}

                    <Table>
                      <Thead>
                        <Tr>
                          <Th color="uspolis.blue">Disciplina</Th>
                          <Th color="uspolis.blue">Tipo</Th>
                          <Th color="uspolis.blue">Categoria</Th>
                          <Th color="uspolis.blue" textAlign="right">
                            Opções
                          </Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {(groupedByPeriod[period] ?? []).map((item) => {
                          const typeMap: Record<string, string> = {
                            semestral: "Semestral",
                            quadrimester: "Quadrimestral",
                          };

                          const categoryMap: Record<string, string> = {
                            mandatory: "Obrigatória",
                            free_elective: "Optativa Livre",
                            track_elective: "Optativa Eletiva",
                          };

                          return (
                            <Tr key={item.id}>
                              <Td>{subjectMap[item.subject_id] ?? "-"}</Td>
                              <Td>{typeMap[item.type] ?? item.type}</Td>
                              <Td>{categoryMap[item.category] ?? item.category}</Td>

                              <Td>
                                <HStack spacing="0px" justifyContent="flex-end">
                                  <Tooltip label="Editar">
                                    <IconButton
                                      colorScheme="yellow"
                                      size="xs"
                                      variant="ghost"
                                      aria-label="editar"
                                      icon={<BsFillPenFill />}
                                      onClick={() => handleEditClick(item)}
                                    />
                                  </Tooltip>

                                  <Tooltip label="Remover">
                                    <IconButton
                                      colorScheme="red"
                                      size="xs"
                                      variant="ghost"
                                      aria-label="remover"
                                      icon={<BsFillTrashFill />}
                                      onClick={() => handleDeleteClick(item)}
                                    />
                                  </Tooltip>
                                </HStack>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </PageContent>
  );
}

export default CurriculumSubjects;