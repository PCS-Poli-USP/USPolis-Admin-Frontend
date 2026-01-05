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
  Text,
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

  async function use() {
    if (class_) {
      setInputClass(class_);
      return;
    }
    if (class_id) {
      const response = await classesService.getById(class_id);
      setInputClass(response.data);
      return;
    }
  }

  useEffect(() => {
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
                  Alocar Turma: {classNumberFromClassCode(inputClass.code)} - {' '}
                  {inputClass.subject_code}{' ('}{inputClass.subject_name}{')'}
                <Text>
                  Vagas:{' '}
                  <strong>
                    {inputClass?.vacancies}
                  </strong>
                </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex flexDir={'column'} gap={4}>
                    {inputClass.schedules.length > 0 && (
                      <>
                        <Flex flexDir={'column'} gap={4}>
                          {inputClass.schedules
                            .sort((a, b) => {
                              if (a.week_day && b.week_day) {
                                return a.week_day - b.week_day;
                              }
                              return 0;
                            })
                            .map((schedule, index) => {
                              const readonly = schedule.classroom_id
                                ? !validator.checkUserClassroomPermission([
                                    schedule.classroom_id,
                                  ])
                                : false;
                              return (
                                <Box key={index}>
                                  <AllocateSingleScheduleSection
                                    key={schedule.id}
                                    user={loggedUser}
                                    ref={(ref) => {
                                      if (readonly) {
                                        sectionsRefs.current[index] = null;
                                        return;
                                      }
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
                                    readonly={readonly}
                                    readonlyData={
                                      readonly
                                        ? {
                                            buildingOpt: {
                                              label:
                                                schedule.building as string,
                                              value:
                                                schedule.building_id as number,
                                            },
                                            classroomOpt: {
                                              label:
                                                schedule.classroom as string,
                                              value:
                                                schedule.classroom_id as number,
                                            },
                                          }
                                        : undefined
                                    }
                                  />
                                  <Divider />
                                </Box>
                              );
                            })}
                        </Flex>
                        <Flex
                          flexGrow={1}
                          justifyContent={'space-between'}
                          gap={2}
                        >
                          <Button
                            onClick={handleSave}
                            flexGrow={1}
                            colorScheme='blue'
                          >
                            Salvar
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
                            onClick={handleClose}
                            flexGrow={1}
                            colorScheme='red'
                          >
                            Cancelar
                          </Button>
                        </Flex>
                      </>
                    )}
                    {!inputClass.schedules ||
                    inputClass.schedules.length === 0 ? (
                      <Alert status='error' mb={'20px'}>
                        <AlertIcon />
                        Esta turma não possui horários cadastrados.
                      </Alert>
                    ) : null}
                  </Flex>
                </ModalBody>
              </>
            ) : (
              <ModalBody>
                <Flex
                  direction={'row'}
                  gap={'10px'}
                  align={'center'}
                  justify={'center'}
                >
                  <Text fontWeight={'bold'} fontSize={'lg'}>
                    Carregando
                  </Text>
                  <Spinner />
                </Flex>
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
