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

import { useState } from "react";
import useCurriculumsService from "../../../hooks/API/services/useCurriculumsService";
import useCustomToast from "../../../hooks/useCustomToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  refresh: () => void;
}


export function CreateCurriculumModal({
  isOpen,
  onClose,
  courseId,
  refresh,
}: Props) {

  const curriculumsService = useCurriculumsService();
  const showToast = useCustomToast();

  const [description, setDescription] = useState("");
  const [AAC, setAAC] = useState<number | undefined>(undefined);
  const [AEX, setAEX] = useState<number | undefined>(undefined);
  const [codcur, setCodcur] = useState<number | undefined>(undefined);
  const [codhab, setCodhab] = useState<number | undefined>(undefined);

  
  function handleClose() {
    setDescription('');
    setAAC(undefined);
    setAEX(undefined);
    setCodcur(undefined);
    setCodhab(undefined);
    onClose();
  }

  async function handleSubmit() {
    try {
      await curriculumsService.create({
        course_id: courseId,
        codcur: codcur ?? 0,
        codhab: codhab ?? 0,
        description: description.trim(),
        AAC: AAC ?? 0,
        AEX: AEX ?? 0,
      });

      showToast(
        'Sucesso',
        'Currículo criado com sucesso.',
        'success',
      );

      refresh();
      onClose();

      setDescription("");
      setAAC(undefined);
      setAEX(undefined);

    } catch (err: unknown) {
      const error = err as any;

      showToast(
        'Erro',
        error?.response?.data?.detail ??
          'Não foi possível criar o currículo.',
        'error',
      );
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
              placeholder="0"
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
              placeholder="0"
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

          <Button colorScheme="blue" onClick={handleSubmit}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}