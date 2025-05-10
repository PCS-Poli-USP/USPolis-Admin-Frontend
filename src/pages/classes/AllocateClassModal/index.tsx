import {
  Alert,
  AlertIcon,
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
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import AllocateSingleScheduleSection, {
  AllocateSingleScheduleSectionRef,
} from './allocateSingleScheduleSection';
import { useContext, useEffect, useRef, useState } from 'react';
import useOccurrences from '../../../hooks/useOccurrences';
import useClassesService from '../../../hooks/API/services/useClassesService';
import { AllocateManySchedulesData } from '../../../hooks/API/services/useOccurrencesService';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import useAllowedBuildings from '../../../hooks/useAllowedBuildings';
import { appContext } from '../../../context/AppContext';
import { UsersValidator } from '../../../utils/users/users.validator';

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
  const { loggedUser } = useContext(appContext);
  const validator = new UsersValidator(loggedUser);

  const classesService = useClassesService();
  const [inputClass, setInputClass] = useState<ClassResponse>();

  const { allocateManySchedules } = useOccurrences();
  const { allowedBuildings, loading } = useAllowedBuildings();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_, class_id]);

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={'xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        {loggedUser ? (
          <>
            {inputClass ? (
              <>
                <ModalHeader>
                  Alocar Turma: {inputClass.subject_code} -{' '}
                  {classNumberFromClassCode(inputClass.code)}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex flexDir={'column'} gap={4}>
                    <Flex flexDir={'column'} gap={4}>
                      {inputClass.schedules
                        .filter((schedule) => {
                          if (!schedule.classroom_id) return true;
                          return validator.checkUserClassroomPermission([
                            schedule.classroom_id,
                          ]);
                        })
                        .map((schedule, index) => (
                          <Box key={index}>
                            <AllocateSingleScheduleSection
                              key={schedule.id}
                              user={loggedUser}
                              ref={(ref) => {
                                sectionsRefs.current[index] = ref;
                              }}
                              schedule={schedule}
                              allowedBuildings={allowedBuildings}
                              loadingBuildings={loading}
                              initialBuildingId={
                                loggedUser
                                  ? loggedUser.buildings &&
                                    loggedUser.buildings.length === 1
                                    ? loggedUser.buildings[0].id
                                    : undefined
                                  : undefined
                              }
                            />
                            <Divider />
                          </Box>
                        ))}
                    </Flex>
                    <Flex flexGrow={1} justifyContent={'space-between'} gap={2}>
                      <Button
                        onClick={handleClose}
                        flexGrow={1}
                        colorScheme='red'
                      >
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
                      <Button
                        onClick={handleSave}
                        flexGrow={1}
                        colorScheme='blue'
                      >
                        Salvar Tudo
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
          </>
        ) : (
          <Alert status='error'>
            <AlertIcon />
            Você não está logado. Por favor, faça login para continuar.
          </Alert>
        )}
      </ModalContent>
    </Modal>
  );
}
