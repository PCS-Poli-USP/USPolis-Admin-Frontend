import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ModalProps } from 'models/interfaces';

interface ClassOccurrencesModalProps extends ModalProps {
  selectedClass: ClassResponse;
}

export default function ClassOccurrencesModal({
  selectedClass,
  isOpen,
  onClose,
}: ClassOccurrencesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Editar Ocorrências ${
          selectedClass.subject_code
        } - ${selectedClass.code.slice(-2)}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme={'blue'}>Salvar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
