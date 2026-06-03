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
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import useCurriculumsService from "../../../hooks/API/services/useCurriculumsService";
import { CurriculumResponse } from "../../../models/http/responses/curriculum.response.models";
import useCustomToast from "../../../hooks/useCustomToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  curriculum?: CurriculumResponse; // ✅ vem direto
  refresh: () => void;
}

export function EditCurriculumModal({
  isOpen,
  onClose,
  curriculum,
  refresh,
}: Props) {

  const curriculumsService = useCurriculumsService();
  const showToast = useCustomToast();

  const [description, setDescription] = useState("");
  const [AAC, setAAC] = useState<number | undefined>(undefined);
  const [AEX, setAEX] = useState<number | undefined>(undefined);
  const [codcur, setCodcur] = useState<number | undefined>(undefined);
  const [codhab, setCodhab] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen && curriculum) {
      setDescription(curriculum.description);
      setAAC(curriculum.AAC ?? undefined);
      setAEX(curriculum.AEX ?? undefined);
      setCodcur(curriculum.codcur);
      setCodhab(curriculum.codhab);
    }
  }, [isOpen, curriculum]);

  function handleClose() {
    setDescription('');
    setAAC(undefined);
    setAEX(undefined);
    setCodcur(undefined);
    setCodhab(undefined);
    onClose();
  }

  async function handleSubmit() {
    if (!curriculum) return;

    try {
      await curriculumsService.update(curriculum.id, {
        course_id: curriculum.course_id,
        codcur: codcur ?? 0,
        codhab: codhab ?? 0,
        description: description.trim(),  
        AAC: AAC ?? 0,
        AEX: AEX ?? 0,
      });

      showToast(
        'Sucesso',
        'Currículo atualizado com sucesso.',
        'success',
      );

      refresh();
      onClose();

    } catch (err: unknown) {
      const error = err as any;

      showToast(
        'Erro',
        error?.response?.data?.detail ??
          'Não foi possível atualizar o currículo.',
        'error',
      );
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Currículo</ModalHeader>

        <ModalBody>

          <FormControl mb={3}>
            <FormLabel>Descrição</FormLabel>
            <Input
              value={description}
              placeholder="Ex: 2026 - Piloto"
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
          <FormLabel>AAC</FormLabel>
          <Input
            type="number"
            placeholder="0"
            value={AAC ?? ''}
            onChange={(e) =>
              setAAC(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>AEX</FormLabel>
          <Input
            type="number"
            placeholder="0"
            value={AEX ?? ''}
            onChange={(e) =>
              setAEX(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </FormControl>
            <FormControl mb={3}>
            <FormLabel>CODCUR</FormLabel>

            <Input
              type="number"
              value={codcur ?? ''}
              onChange={(e) =>
                setCodcur(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            />
            </FormControl>

          <FormControl mb={3}>
            <FormLabel>CODHAB</FormLabel>

            <Input
              type="number"
              value={codhab ?? ''}
              onChange={(e) =>
                setCodhab(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            />
          </FormControl>

        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={handleClose}>
            Cancelar
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!curriculum}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}