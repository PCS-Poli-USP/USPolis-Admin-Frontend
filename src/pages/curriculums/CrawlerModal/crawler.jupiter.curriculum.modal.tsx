import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
  Divider,
  Box,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { ModalProps } from '../../../models/interfaces';
import useCurriculumsService, {
  JupiterCurriculumPreviewResponse,
} from '../../../hooks/API/services/useCurriculumsService';

interface CrawlerJupiterCurriculumModalProps extends ModalProps {
  courseId: number;
  onSaved: () => void;
}

export default function CrawlerJupiterCurriculumModal({
  isOpen,
  onClose,
  courseId,
  onSaved,
}: CrawlerJupiterCurriculumModalProps) {
  const { previewByJupiter, createByJupiter } = useCurriculumsService();

  const [codcur, setCodcur] = useState('');
  const [codhab, setCodhab] = useState('');
  const [description, setDescription] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [previewData, setPreviewData] =
    useState<JupiterCurriculumPreviewResponse>();
  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState(false);

  function onOpenPreviewModal() {
    setIsOpenPreviewModal(true);
  }

  function onClosePreviewModal() {
    setIsOpenPreviewModal(false);
  }

  function reset() {
    setCodcur('');
    setCodhab('');
    setDescription('');
    setPreviewData(undefined);
    setShowValidationError(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const isValid =
    codcur.length > 0 &&
    codhab.length > 0 &&
    description.trim().length > 0 &&
    !isNaN(Number(codcur)) &&
    !isNaN(Number(codhab));

  async function handleConfirmClick() {
    setShowValidationError(true);

    if (!isValid) return;

    setLoadingPreview(true);

    try {
      const res = await previewByJupiter({
        course_id: courseId,
        description: description.trim(),
        codcur: Number(codcur),
        codhab: Number(codhab),
      });

      setPreviewData(res.data);
      onOpenPreviewModal();
    } catch (err) {
      console.error("ERRO PREVIEW:", err);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleSaveClick() {
    if (!previewData) return;

    setLoadingSave(true);

    try {
      const codcurNum = Number(codcur);
      const codhabNum = Number(codhab);

      await createByJupiter({
        course_id: courseId,
        description: previewData.description,
        codcur: codcurNum,
        codhab: codhabNum,
      });

      onClosePreviewModal();
      handleClose();

      onSaved();
    } catch (err) {
      console.error('ERRO SAVE:', err);
    } finally {
      setLoadingSave(false);
    }
  }

  type PreviewSubject = {
    subject_code: string;
    subject_name: string;
    period: number;
    category: 'Obrigatória' | 'Optativa Livre' | 'Optativa Eletiva';
  };

  function buildAllSubjects(): PreviewSubject[] {
    if (!previewData) return [];

    const mandatory = previewData.mandatory.map((s) => ({
      ...s,
      category: 'Obrigatória' as const,
    }));

    const free = previewData.free.map((s) => ({
      ...s,
      category: 'Optativa Livre' as const,
    }));

    const elective = previewData.elective.map((s) => ({
      ...s,
      category: 'Optativa Eletiva' as const,
    }));

    return [...mandatory, ...free, ...elective];
  }

  function groupAllByPeriod(subjects: PreviewSubject[]) {
    const grouped: Record<number, PreviewSubject[]> = {};

    subjects.forEach((s) => {
      if (!grouped[s.period]) grouped[s.period] = [];
      grouped[s.period].push(s);
    });

    return grouped;
  }

  const allGrouped = useMemo(() => {
    if (!previewData) return {};

    const all = buildAllSubjects();
    const grouped = groupAllByPeriod(all);

    Object.values(grouped).forEach((list) => {
      list.sort((a, b) => a.subject_code.localeCompare(b.subject_code));
    });

    return grouped;
  }, [previewData]);

  return (
    <>
      {/* MODAL 1 - INPUT */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={'xl'}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Currículo via Júpiter</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex direction={'column'} gap={'15px'}>
              <Text>
                Informe o <b>codcur</b> e o <b>codhab</b> do currículo no Júpiter.
              </Text>

              <VStack alignItems={'flex-start'} w={'100%'} gap={'10px'}>
                <Flex direction={'column'} w={'100%'} gap={'5px'}>
                  <Text fontWeight={'bold'}>Descrição do Currículo</Text>
                  <Input
                    placeholder="Ex: 2026 - Turma Piloto"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Flex>

                <Flex direction={'column'} w={'100%'} gap={'5px'}>
                  <Text fontWeight={'bold'}>codcur</Text>
                  <Input
                    placeholder="0"
                    value={codcur}
                    onChange={(e) =>
                      setCodcur(e.target.value.replaceAll(' ', ''))
                    }
                  />
                </Flex>

                <Flex direction={'column'} w={'100%'} gap={'5px'}>
                  <Text fontWeight={'bold'}>codhab</Text>
                  <Input
                    placeholder="0"
                    value={codhab}
                    onChange={(e) =>
                      setCodhab(e.target.value.replaceAll(' ', ''))
                    }
                  />
                </Flex>
              </VStack>

              {showValidationError && !isValid && (
                <Alert status="error" fontSize={'sm'}>
                  <AlertIcon />
                  Preencha descrição, codcur e codhab corretamente.
                </Alert>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <HStack w={'100%'}>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>

              <Spacer />

              <Button
                colorScheme="blue"
                onClick={handleConfirmClick}
                disabled={!isValid}
                isLoading={loadingPreview}
              >
                Confirmar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL 2 - PREVIEW */}
      <Modal
        isOpen={isOpenPreviewModal}
        onClose={onClosePreviewModal}
        size={'4xl'}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resumo do Currículo (Júpiter)</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {previewData ? (
              <Flex direction={'column'} gap={'15px'}>
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {previewData.description}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Dados extraídos do Júpiter
                  </Text>
                </Box>

                <Divider />

                <VStack align="start" spacing={1}>
                  <Text>
                    <b>AAC:</b> {previewData.AAC}
                  </Text>

                  <Text>
                    <b>AEX:</b> {previewData.AEX}
                  </Text>
                </VStack>

                <Divider />

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Disciplinas que serão salvas:
                  </Text>

                  {Object.keys(allGrouped).length === 0 ? (
                    <Text>Nenhuma disciplina encontrada.</Text>
                  ) : (
                    Object.entries(allGrouped)
                      .sort((a, b) => Number(a[0]) - Number(b[0]))
                      .map(([period, list]) => (
                        <Box key={period} mb={6}>
                          <Text fontWeight="bold" mb={2}>
                            {period}° Período  ({list.length} Disciplinas)
                          </Text>

                          <VStack align="start" spacing={1}>
                            {list.map((s) => (
                              <Text key={`${s.subject_code}-${s.category}`}>
                                <b>{s.subject_code}</b> - {s.subject_name} (
                                {s.category})
                              </Text>
                            ))}
                          </VStack>
                        </Box>
                      ))
                  )}
                </Box>
              </Flex>
            ) : (
              <Alert status="error">
                <AlertIcon />
                Não foi possível gerar o resumo.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack w={'100%'}>
              <Button variant="outline" onClick={onClosePreviewModal}>
                Voltar
              </Button>

              <Spacer />

              <Button
                colorScheme="blue"
                onClick={handleSaveClick}
                isLoading={loadingSave}
                disabled={!previewData}
              >
                Salvar Currículo
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}