import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import {
  ClassFullResponse,
  ClassResponse,
} from 'models/http/responses/class.response.models';
import { ModalProps } from 'models/interfaces';
import ScheduleAccordion from './schedule.accordion';
import { useEffect, useState } from 'react';
import useClasses from 'hooks/useClasses';

interface ClassOccurrencesModalProps extends ModalProps {
  selectedClass: ClassResponse;
}

export default function ClassOccurrencesModal({
  selectedClass,
  isOpen,
  onClose,
}: ClassOccurrencesModalProps) {
  const [classFull, setClassFull] = useState<ClassFullResponse | undefined>(
    undefined,
  );
  const { getClassFull } = useClasses(false);

  useEffect(() => {
    const getOccurrences = async () => {
      const full = await getClassFull(selectedClass.id);
      setClassFull(full);
    };
    getOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  return (
    <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Editar Ocorrências ${
          selectedClass.subject_code
        } - ${selectedClass.code.slice(-2)}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ScheduleAccordion class={classFull} />
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
