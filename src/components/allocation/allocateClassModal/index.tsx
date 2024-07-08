import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { ClassResponse } from 'models/http/responses/class.response.models';
import AllocateSingleScheduleSection, {
  AllocateSingleScheduleSectionRef,
} from './allocateSingleScheduleSection';
import { useRef } from 'react';
import OccurrencesService, {
  AllocateManySchedulesData,
} from 'services/api/occurrences.service';

interface props {
  isOpen: boolean;
  onClose: () => void;
  refresh?: () => void;
  class_?: ClassResponse;
}

export function AllocateClassModal({
  isOpen,
  onClose,
  refresh,
  class_,
}: props) {
  const occurrencesService = new OccurrencesService();

  const sectionsRefs = useRef<(AllocateSingleScheduleSectionRef | null)[]>([]);

  function reset() {
    for (const ref of sectionsRefs.current) ref?.reset();
  }

  async function handleSave() {
    const data: AllocateManySchedulesData[] = [];
    for (const ref of sectionsRefs.current) {
      const sectionData = ref?.getData();
      if (sectionData) data.push(sectionData);
    }
    await occurrencesService.allocate_many_schedules(data);
    if (refresh) refresh();
    onClose();
  }

  return !class_ ? (
    <></>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Alocar Turma: {class_.subject_code} - {class_.code}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir={'column'} gap={4}>
            <Button
              flexGrow={1}
              alignSelf={'stretch'}
              onClick={() => {
                reset();
              }}
            >
              Descartar Mudanças
            </Button>
            <Divider />
            <Flex flexDir={'column'} gap={4}>
              {class_.schedules.map((schedule, index) => (
                <>
                  <AllocateSingleScheduleSection
                    key={schedule.id}
                    ref={(ref) => (sectionsRefs.current[index] = ref)}
                    schedule={schedule}
                  />
                  <Divider />
                </>
              ))}
            </Flex>
            <Flex flexGrow={1} justifyContent={'space-between'} gap={2}>
              <Button onClick={onClose} flexGrow={1} colorScheme='red'>
                Cancelar
              </Button>
              <Button onClick={handleSave} flexGrow={1} colorScheme='blue'>
                Salvar
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
