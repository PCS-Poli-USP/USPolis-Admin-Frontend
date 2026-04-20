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
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import useCurriculumsService from "../../../hooks/API/services/useCurriculumsService";
import { CurriculumResponse } from "../../../models/http/responses/curriculum.response.models";

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
  const toast = useToast();

  const [description, setDescription] = useState("");
  const [AAC, setAAC] = useState<number | undefined>(undefined);
  const [AEX, setAEX] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen && curriculum) {
      setDescription(curriculum.description);
      setAAC(curriculum.AAC ?? undefined);
      setAEX(curriculum.AEX ?? undefined);
    }
  }, [isOpen, curriculum]);

  function handleClose() {
    setDescription('');
    setAAC(undefined);
    setAEX(undefined);
    onClose();
  }

  async function handleSubmit() {
    if (!curriculum) return;

    try {
      await curriculumsService.update(curriculum.id, {
        course_id: curriculum.course_id,
        description,
        AAC: AAC ?? 0,
        AEX: AEX ?? 0,
      });

      toast({
        title: "Currículo atualizado",
        status: "success",
      });

      refresh();
      onClose();

    } catch {
      toast({
        title: "Erro ao atualizar currículo",
        status: "error",
      });
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