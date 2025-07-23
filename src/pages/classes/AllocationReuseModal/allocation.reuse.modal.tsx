import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepDescription,
  StepSeparator,
  Text,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';

import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { useState } from 'react';
import AllocationReuseModalFirstStep from './Steps/First/allocation.reuse.modal.first.step';
import { SubjectResponse } from '../../../models/http/responses/subject.response.models';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import AllocationReuseModalSecondStep from './Steps/Second/allocation.reuse.second.step';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import AllocationReuseModalThirdStep from './Steps/Third/allocation.reuse.modal.third.step';
import useOccurrences from '../../../hooks/useOccurrences';
import { AllocateManySchedulesData } from '../../../hooks/API/services/useOccurrencesService';
import { ScheduleResponse } from '../../../models/http/responses/schedule.response.models';
import { CreateSchedule } from '../../../models/http/requests/schedule.request.models';
import useSchedules from '../../../hooks/useSchedules';
import { AllocationReuseResponse } from '../../../models/http/responses/allocation.response.models';

interface AllocationReuseModalProps extends ModalProps {
  subjects: SubjectResponse[];
  classes: ClassResponse[];
  buildings: BuildingResponse[];
  refetch: () => Promise<void>;
}

export interface SubjectWithClasses {
  subject_id: number;
  class_ids: number[];
}

export interface ScheduleAllocationData {
  classroom_ids: number[];
  classrooms: string[];
}

function AllocationReuseModal({
  isOpen,
  onClose,
  subjects,
  classes,
  buildings,
  refetch,
}: AllocationReuseModalProps) {
  const { allocateManySchedules } = useOccurrences();
  const { createManyForClasses } = useSchedules();
  const [map, setMap] = useState<Map<number, SubjectWithClasses>>(new Map());
  const [allocationMap, setAllocationMap] = useState<
    Map<number, ScheduleAllocationData>
  >(new Map());
  const classesBySubject = new Map<number, ClassResponse[]>();
  subjects.forEach((subject) => {
    classesBySubject.set(
      subject.id,
      classes.filter((cls) => cls.subject_id === subject.id),
    );
  });
  const [selectedClasses, setSelectedClasses] = useState<Set<number>>(
    new Set(),
  );
  const [selectedSubjects, setSelectedSubjects] = useState<Set<number>>(
    new Set(),
  );
  const [selectedBuilding, setSelectedBuilding] = useState<
    BuildingResponse | undefined
  >(buildings.length === 1 ? buildings[0] : undefined);
  const [allocationReuseResponse, setAllocationReuseResponse] =
    useState<AllocationReuseResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const steps = [
    {
      title: 'Primeiro',
      description: 'Disciplinas/Turmas',
      content: (
        <AllocationReuseModalFirstStep
          subjects={subjects}
          classesBySubject={classesBySubject}
          map={map}
          setMap={setMap}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          setSelectedSubjects={setSelectedSubjects}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Alocações',
      content: (
        <AllocationReuseModalSecondStep
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          map={map}
          allocationMap={allocationMap}
          setAllocationMap={setAllocationMap}
          allocationReuseResponse={allocationReuseResponse}
          setAllocationReuseResponse={setAllocationReuseResponse}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
    {
      title: 'Terceiro',
      description: 'Revisão',
      content: (
        <AllocationReuseModalThirdStep
          subjects={subjects}
          classesBySubject={classesBySubject}
          selectedSubjects={selectedSubjects}
          selectedClasses={selectedClasses}
          allocationMap={allocationMap}
        />
      ),
    },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [stepsIsValid, setStepsIsValid] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  const [stepsInvalidText, setStepsInvalidText] = useState<[string, string]>([
    'Inválido',
    'Inválido',
  ]);

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  function validateFirstStep() {
    const isValid = map.size > 0 && selectedClasses.size > 0;
    setStepsIsValid([isValid, stepsIsValid[1]]);

    if (!map.size) {
      setStepsInvalidText([
        'Selecione ao menos uma disciplina',
        stepsInvalidText[1],
      ]);
    } else if (!selectedClasses.size) {
      setStepsInvalidText([
        'Selecione ao menos uma turma',
        stepsInvalidText[1],
      ]);
    } else {
      setStepsInvalidText(['Inválido', stepsInvalidText[1]]);
    }
    return isValid;
  }

  function validateSecondStep() {
    const classroomIds = new Array<number>();
    allocationMap
      .values()
      .forEach((data) => classroomIds.push(...data.classroom_ids));
    const isValid = classroomIds.length > 0;
    setStepsIsValid([stepsIsValid[0], isValid]);

    if (!classroomIds.length) {
      setStepsInvalidText([
        stepsInvalidText[0],
        'Selecione ao menos uma alocação',
      ]);
    }
    if (classroomIds.length) {
      setStepsInvalidText([stepsInvalidText[0], 'Inválido']);
    }
    return isValid;
  }

  function validateSteps() {
    const firstStepValid = validateFirstStep();
    const secondStepValid = validateSecondStep();
    return firstStepValid && secondStepValid;
  }

  function handleNextClick() {
    if (activeStep === 0) {
      const isValid = validateFirstStep();
      if (!isValid) return;
    }
    if (activeStep === 1) {
      const isValid = validateSecondStep();
      if (!isValid) return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  }

  function handleCloseModal() {
    setActiveStep(0);
    setMap(new Map());
    setAllocationMap(new Map());
    setSelectedClasses(new Set());
    setSelectedSubjects(new Set());
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      size={'4xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reaproveitamento de Alocações</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack w={'full'}>
            <Stepper
              size='lg'
              index={activeStep}
              alignItems={'center'}
              mb={'10px'}
            >
              {steps.map((step, index) => (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink='0'>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                    <Text
                      color={stepsIsValid[index] ? undefined : 'red'}
                      hidden={stepsIsValid[index]}
                    >
                      {stepsInvalidText[index]}
                    </Text>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {steps[activeStep].content ? (
              steps[activeStep].content
            ) : (
              <Alert status='error' fontSize='sm' mt={4}>
                <AlertIcon />
                Não foi possível carregar o conteúdo do passo atual
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack width={'full'}>
            <HStack spacing='10px' alignSelf={'flex-end'}>
              <Button
                colorScheme={'red'}
                onClick={handleCloseModal}
                rightIcon={<SmallCloseIcon />}
              >
                Cancelar
              </Button>
              <Button
                colorScheme={'blue'}
                isDisabled={activeStep === 0}
                leftIcon={<ArrowBackIcon />}
                onClick={handlePreviousClick}
              >
                Anterior
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  colorScheme={'blue'}
                  onClick={async () => {
                    const isValid = validateSteps();
                    if (!isValid) return;

                    const schedules: ScheduleResponse[] = [];
                    classes.forEach((cls) => {
                      schedules.push(...cls.schedules);
                    });
                    const allocationData: AllocateManySchedulesData[] = [];
                    const createScheduleData: CreateSchedule[] = [];

                    allocationMap.forEach((data, scheduleId) => {
                      const originalSchedule = schedules.find(
                        (schedule) => schedule.id === scheduleId,
                      );
                      if (!originalSchedule) return;
                      const originalClass = classes.find(
                        (cls) => cls.id === originalSchedule.class_id,
                      );
                      if (!originalClass) return;

                      if (data.classroom_ids.length) {
                        allocationData.push({
                          schedule_id: scheduleId,
                          classroom_id: data.classroom_ids[0],
                          intentional_conflict: false,
                          intentional_occurrence_ids: [],
                        });
                        data.classroom_ids.slice(1).forEach((classroomId) => {
                          createScheduleData.push({
                            class_id: originalSchedule.class_id,
                            reservation_id: originalSchedule.reservation_id,
                            classroom_id: classroomId,
                            start_date: originalSchedule.start_date,
                            end_date: originalSchedule.end_date,
                            recurrence: originalSchedule.recurrence,
                            all_day: originalSchedule.all_day,
                            week_day: originalSchedule.week_day,
                            start_time: originalSchedule.start_time,
                            end_time: originalSchedule.end_time,
                            dates: originalSchedule.occurrences
                              ? originalSchedule.occurrences.map(
                                  (occ) => occ.date,
                                )
                              : undefined,
                            month_week: originalSchedule.month_week,
                          });
                        });
                      }
                    });
                    if (createScheduleData.length) {
                      await createManyForClasses({
                        inputs: createScheduleData,
                      });
                    }
                    if (allocationData.length) {
                      await allocateManySchedules(allocationData);
                    }
                    handleCloseModal();
                    await refetch();
                  }}
                  rightIcon={<DownloadIcon />}
                  isLoading={false}
                >
                  Finalizar
                </Button>
              ) : (
                <Button
                  colorScheme={'blue'}
                  rightIcon={<ArrowForwardIcon />}
                  onClick={handleNextClick}
                >
                  Próximo
                </Button>
              )}
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AllocationReuseModal;
