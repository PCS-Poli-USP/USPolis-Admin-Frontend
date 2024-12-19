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
  Spinner,
} from '@chakra-ui/react';
import { ClassResponse } from 'models/http/responses/class.response.models';
import AllocateSingleScheduleSection, {
  AllocateSingleScheduleSectionRef,
} from './allocateSingleScheduleSection';
import { useEffect, useRef, useState } from 'react';
import useOccurrences from 'hooks/useOccurrences';
import useClassesService from 'hooks/API/services/useClassesService';
import { AllocateManySchedulesData } from 'hooks/API/services/useOccurrencesService';

interface props {
  isOpen: boolean;
  onClose: () => void;
  refresh?: () => void;
  class_?: ClassResponse;
  class_id?: number;
}

export function AllocateClassModal({
  isOpen,
  onClose,
  refresh,
  class_,
  class_id,
}: props) {
  const classesService = useClassesService();
  const [inputClass, setInputClass] = useState<ClassResponse>();

  const { allocateManySchedules } = useOccurrences();

  const sectionsRefs = useRef<(AllocateSingleScheduleSectionRef | null)[]>([]);

  function reset() {
    for (const ref of sectionsRefs.current) ref?.reset();
  }

  useEffect(() => {
    async function use() {
      if (class_) {
        setInputClass(class_);
        return;
      }
      if (class_id) {
        const response = await classesService.getById(class_id);
        setInputClass(response.data);
      }
    }
    use();
  }, [class_, class_id, classesService]);

  async function handleSave() {
    const data: AllocateManySchedulesData[] = [];
    for (const ref of sectionsRefs.current) {
      const sectionData = ref?.getData();
      if (sectionData) data.push(sectionData);
    }
    await allocateManySchedules(data);
    if (refresh) refresh();
    handleClose();
  }

  function handleClose() {
    setInputClass(undefined);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        {inputClass ? (
          <>
            <ModalHeader>
              Alocar Turma: {inputClass.subject_code} -{' '}
              {inputClass.code.slice(-2)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir={'column'} gap={4}>
                <Flex flexDir={'column'} gap={4}>
                  {inputClass.schedules.map((schedule, index) => (
                    <Box key={index}>
                      <AllocateSingleScheduleSection
                        key={schedule.id}
                        ref={(ref) => (sectionsRefs.current[index] = ref)}
                        schedule={schedule}
                      />
                      <Divider />
                    </Box>
                  ))}
                </Flex>
                <Flex flexGrow={1} justifyContent={'space-between'} gap={2}>
                  <Button onClick={handleClose} flexGrow={1} colorScheme='red'>
                    Cancelar
                  </Button>
                  <Button
                    flexGrow={1}
                    alignSelf={'stretch'}
                    onClick={() => {
                      reset();
                    }}
                  >
                    Restaurar
                  </Button>
                  <Button onClick={handleSave} flexGrow={1} colorScheme='blue'>
                    Salvar
                  </Button>
                </Flex>
              </Flex>
            </ModalBody>
          </>
        ) : (
          <ModalBody>
            <Spinner />
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
