import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  HStack,
  VStack,
  Box,
  Text as ChakraText,
  Divider,
  Alert,
  AlertIcon,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";

import useCurriculumsService, {
  JupiterCurriculumPreviewResponse,
  MissingSubjectResponse,
} from "../../../hooks/API/services/useCurriculumsService";

import useJupiterService, {
  CourseOptionResponse,
} from "../../../hooks/API/services/useJupiterService";

import TooltipSelect, {
  Option,
} from "../../../components/common/TooltipSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  refetch: () => void;

  setMissingSubjects: (
    subjects: MissingSubjectResponse[],
  ) => void;

  setShowMissingWindow: (
    value: boolean,
  ) => void;
}

type PreviewSubject = {
  subject_code: string;
  subject_name: string;
  period: number;
  category:
    | "Obrigatória"
    | "Optativa Livre"
    | "Optativa Eletiva";
};

export default function CreateCurriculumByJupiterModal({
  isOpen,
  onClose,
  courseId,
  refetch,
  setMissingSubjects,
  setShowMissingWindow,
}: Props) {
  const toast = useToast();

  const curriculumsService = useCurriculumsService();
  const jupiterService = useJupiterService();

  const [description, setDescription] = useState("");

  const [courses, setCourses] = useState<
    CourseOptionResponse[]
  >([]);

  const [courseOptions, setCourseOptions] = useState<
    Option[]
  >([]);

  const [selectedCourses, setSelectedCourses] =
    useState<Option[]>([]);

  const [loadingCourses, setLoadingCourses] =
    useState(false);

  const [loadingSync, setLoadingSync] =
    useState(false);

  const [loadingPreview, setLoadingPreview] =
    useState(false);

  const [loadingSubmit, setLoadingSubmit] =
    useState(false);

  const [previewData, setPreviewData] =
    useState<JupiterCurriculumPreviewResponse>();

  const [isOpenPreviewModal, setIsOpenPreviewModal] =
    useState(false);

  async function loadCachedCourses() {
    try {
      setLoadingCourses(true);

      const response =
        await jupiterService.getCachedCourseOptions();

      setCourses(response.data);

      setCourseOptions(
        response.data.map((c) => ({
          label: `${c.codcur} ${c.codhab} - ${c.name}`,
          value: `${c.codcur}-${c.codhab}`,
        })),
      );
    } catch (err) {
      toast({
        title: "Erro ao carregar cursos",
        description:
          "Não foi possível carregar os cursos salvos no banco.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingCourses(false);
    }
  }

  async function syncCourses() {
    try {
      setLoadingSync(true);

      const response =
        await jupiterService.syncCourseOptions(3);

      setCourses(response.data);

      setCourseOptions(
        response.data.map((c) => ({
          label: `${c.codcur} ${c.codhab} - ${c.name}`,
          value: `${c.codcur}-${c.codhab}`,
        })),
      );

      toast({
        title: "Cursos sincronizados",
        description:
          "A lista de cursos foi atualizada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } catch (err) {
      toast({
        title: "Erro ao sincronizar cursos",
        description:
          "Não foi possível sincronizar com o Júpiter.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingSync(false);
    }
  }

  function reset() {
    setDescription("");
    setSelectedCourses([]);
    setPreviewData(undefined);
    setIsOpenPreviewModal(false);
  }

  function handleCloseAll() {
    reset();
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;

    reset();
    loadCachedCourses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function getSelectedCourse() {
    const selected = selectedCourses[0];

    if (!selected) return null;

    const course = courses.find(
      (c) =>
        `${c.codcur}-${c.codhab}` === selected.value,
    );

    return course ?? null;
  }

  async function handlePreview() {
    if (!description.trim()) {
      toast({
        title: "Descrição obrigatória",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    if (selectedCourses.length === 0) {
      toast({
        title: "Selecione um curso",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    const course = getSelectedCourse();

    if (!course) {
      toast({
        title: "Curso inválido",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    try {
      setLoadingPreview(true);

      const res =
        await curriculumsService.previewByJupiter({
          course_id: courseId,
          description,
          codcur: course.codcur,
          codhab: course.codhab,
        });

      setPreviewData(res.data);
      setIsOpenPreviewModal(true);
    } catch (err: unknown) {
      const error = err as any;

      toast({
        title: "Erro ao gerar resumo",
        description:
          error?.response?.data?.detail ??
          error?.message ??
          "Erro desconhecido",

        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleSubmit() {
    if (!previewData) return;
    const course = getSelectedCourse();

    if (!course) return;

    try {
      setLoadingSubmit(true);

      const res =
        await curriculumsService.createByJupiter({
          course_id: courseId,
          codcur: course.codcur,
          codhab: course.codhab,
          description: previewData.description,
          AAC: previewData.AAC,
          AEX: previewData.AEX,
          mandatory: previewData.mandatory,
          free: previewData.free,
          elective: previewData.elective,
        });

      toast({
        title: "Currículo criado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });

      const missing = Array.isArray(
        res.data?.missing_subjects,
      )
        ? res.data.missing_subjects
        : [];

      if (missing.length > 0) {
        setMissingSubjects(missing);

        setShowMissingWindow(true);
      }

      refetch();

      handleCloseAll();
    } catch (err: unknown) {
      const error = err as any;

      toast({
        title: "Erro ao criar currículo",
        description:
          error?.response?.data?.detail ??
          error?.message ??
          "Erro desconhecido",

        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingSubmit(false);
    }
  }

  function buildAllSubjects(): PreviewSubject[] {
    if (!previewData) return [];

    const mandatory = previewData.mandatory.map(
      (s) => ({
        ...s,
        category: "Obrigatória" as const,
      }),
    );

    const free = previewData.free.map((s) => ({
      ...s,
      category: "Optativa Livre" as const,
    }));

    const elective = previewData.elective.map(
      (s) => ({
        ...s,
        category: "Optativa Eletiva" as const,
      }),
    );

    return [...mandatory, ...free, ...elective];
  }

  function groupAllByPeriod(
    subjects: PreviewSubject[],
  ) {
    const grouped: Record<
      number,
      PreviewSubject[]
    > = {};

    subjects.forEach((s) => {
      if (!grouped[s.period]) {
        grouped[s.period] = [];
      }

      grouped[s.period].push(s);
    });

    return grouped;
  }

  const allGrouped = useMemo(() => {
    if (!previewData) return {};

    const all = buildAllSubjects();

    const grouped = groupAllByPeriod(all);

    Object.values(grouped).forEach((list) => {
      list.sort((a, b) =>
        a.subject_code.localeCompare(
          b.subject_code,
        ),
      );
    });

    return grouped;
  }, [previewData]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAll}
        size="lg"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            Criar Currículo pelo Júpiter
          </ModalHeader>

          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Descrição</FormLabel>

              <Input
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Ex: 2026 - Piloto"
              />
            </FormControl>

            <FormControl mb={4}>
              <HStack
                justify="space-between"
                mb={2}
              >
                <FormLabel m={0}>
                  Curso
                </FormLabel>

                <Button
                  size="sm"
                  variant="solid"
                  colorScheme="green"
                  onClick={syncCourses}
                  isLoading={loadingSync}
                >
                  Sincronizar
                </Button>
              </HStack>

              {loadingCourses ? (
                <Spinner />
              ) : (
                <TooltipSelect
                  placeholder="Selecione um curso"
                  isMulti={false}
                  isLoading={
                    loadingCourses || loadingSync
                  }
                  closeMenuOnSelect={true}
                  value={selectedCourses}
                  options={courseOptions}
                  onChange={(selected) => {
                    if (!selected) {
                      setSelectedCourses([]);

                      return;
                    }

                    const single =
                      selected as Option;

                    setSelectedCourses([single]);
                  }}
                />
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={handleCloseAll}
            >
              Cancelar
            </Button>

            <Button
              colorScheme="blue"
              onClick={handlePreview}
              isLoading={loadingPreview}
              isDisabled={
                loadingCourses || loadingSync
              }
            >
              Gerar resumo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenPreviewModal}
        onClose={() =>
          setIsOpenPreviewModal(false)
        }
        size="4xl"
        scrollBehavior="inside"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            Resumo do Currículo (Júpiter)
          </ModalHeader>

          <ModalBody>
            {previewData ? (
              <Box>
                <ChakraText
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {previewData.description}
                </ChakraText>

                <Divider my={4} />

                <VStack
                  align="start"
                  spacing={1}
                  mb={4}
                >
                  <ChakraText>
                    <b>AAC:</b>{" "}
                    {previewData.AAC}
                  </ChakraText>

                  <ChakraText>
                    <b>AEX:</b>{" "}
                    {previewData.AEX}
                  </ChakraText>
                </VStack>

                <Divider my={4} />

                <ChakraText
                  fontWeight="bold"
                  fontSize="lg"
                  mb={2}
                >
                  Disciplinas que serão salvas:
                </ChakraText>

                {Object.keys(allGrouped)
                  .length === 0 ? (
                  <ChakraText>
                    Nenhuma disciplina encontrada.
                  </ChakraText>
                ) : (
                  <Accordion
                    allowMultiple
                    defaultIndex={[]}
                    w="100%"
                  >
                    {Object.entries(allGrouped)
                      .sort(
                        (a, b) =>
                          Number(a[0]) -
                          Number(b[0]),
                      )
                      .map(
                        ([period, list]) => (
                          <AccordionItem
                            key={period}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            mb={3}
                          >
                            <h2>
                              <AccordionButton>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold"
                                >
                                  {period}°
                                  Período (
                                  {
                                    list.length
                                  }{" "}
                                  disciplinas)
                                </Box>

                                <AccordionIcon />
                              </AccordionButton>
                            </h2>

                            <AccordionPanel pb={4}>
                              <VStack
                                align="start"
                                spacing={1}
                              >
                                {list.map((s) => (
                                  <ChakraText
                                    key={`${s.subject_code}-${s.category}`}
                                    fontSize="sm"
                                  >
                                    <b>
                                      {
                                        s.subject_code
                                      }
                                    </b>{" "}
                                    -{" "}
                                    {
                                      s.subject_name
                                    }{" "}
                                    (
                                    {
                                      s.category
                                    }
                                    )
                                  </ChakraText>
                                ))}
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        ),
                      )}
                  </Accordion>
                )}
              </Box>
            ) : (
              <Alert status="error">
                <AlertIcon />
                Não foi possível gerar o resumo.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() =>
                setIsOpenPreviewModal(false)
              }
            >
              Voltar
            </Button>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loadingSubmit}
              isDisabled={
                !previewData || loadingPreview
              }
            >
              Salvar currículo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}