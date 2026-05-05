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

import { useState } from "react";
import useCurriculumsService from "../../../hooks/API/services/useCurriculumsService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: number; // ✅ agora vem pronto
  refresh: () => void;
}


export function CreateCurriculumModal({
  isOpen,
  onClose,
  courseId,
  refresh,
}: Props) {

  const curriculumsService = useCurriculumsService();
  const toast = useToast();

  const [description, setDescription] = useState("");
  const [AAC, setAAC] = useState<number | undefined>(undefined);
  const [AEX, setAEX] = useState<number | undefined>(undefined);

  
  function handleClose() {
    setDescription('');
    setAAC(undefined);
    setAEX(undefined);
    onClose();
  }

  async function handleSubmit() {
    try {
      await curriculumsService.create({
        course_id: courseId,
        description,
        AAC: AAC ?? 0,
        AEX: AEX ?? 0,
      });

      toast({
        title: "Currículo criado",
        status: "success",
         position: "top-left",
      });

      refresh();
      onClose();

      setDescription("");
      setAAC(undefined);
      setAEX(undefined);

    } catch {
      toast({
        title: "Erro ao criar currículo",
        status: "error",
         position: "top-left",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Criar Currículo</ModalHeader>

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

          <Button colorScheme="blue" onClick={handleSubmit}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}