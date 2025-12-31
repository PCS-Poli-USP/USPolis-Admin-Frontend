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
import { AllocationReuseResponse } from '../../../models/http/responses/allocation.response.models';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import AllocationReuseModalFirstStep from './Steps/First/allocation.reuse.modal.first.step';
import { SubjectResponse } from '../../../models/http/responses/subject.response.models';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import AllocationReuseModalSecondStep from './Steps/Second/allocation.reuse.second.step';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import AllocationReuseModalThirdStep from './Steps/Third/allocation.reuse.modal.third.step';
import useAllocationsService from '../../../hooks/API/services/useAllocationService';
import {
  AllocationMapInput,
  AllocationMapValue,
} from '../../../models/http/requests/allocation.request.models';
import useCustomToast from '../../../hooks/useCustomToast';
import { AxiosErrorResponse } from '../../../models/http/responses/common.response.models';

interface AllocationReuseModalProps extends ModalProps {
  data?: AllocationReuseResponse;
  subjects: SubjectResponse[];
  classes: ClassResponse[];
  buildings: BuildingResponse[];
  refetch: () => void;
}

export interface ScheduleAllocationData {
  classroom_ids: number[];
  classrooms: string[];
}

export interface SubjectWithClasses {
  subject_id: number;
  class_ids: number[];
}

function AllocationReuseModal({
  isOpen,
  onClose,
  subjects,
  classes,
  buildings,
  refetch,
}: AllocationReuseModalProps) {
  const { getAllocationOptions, applyAllocationMap } = useAllocationsService();
  const toast = useCustomToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Map<number, SubjectWithClasses>>(new Map());
  const [allocationMap, setAllocationMap] = useState<
    Map<number, ScheduleAllocationData>
  >(new Map());
  const [selectedBuilding, setSelectedBuilding] = useState<
    BuildingResponse | undefined
  >(buildings.length === 1 ? buildings[0] : undefined);
  const [allocationReuseResponse, setAllocationReuseResponse] =
    useState<AllocationReuseResponse>();
  const [mustRefetch, setMustRefetch] = useState(
    allocationReuseResponse == undefined,
  );

  const classesBySubject = new Map<number, ClassResponse[]>();
  subjects.forEach((subject) => {
    classesBySubject.set(
      subject.id,
      classes.filter((cls) => cls.subject_id === subject.id),
    );
  });

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const [stepsIsValid, setStepsIsValid] = useState<[boolean, boolean, true]>([
    true,
    true,
    true,
  ]);

  const steps = [
    {
      title: 'Primeiro',
      description: 'Disciplinas e Turmas',
      content: (
        <AllocationReuseModalFirstStep
          subjects={subjects.filter(
            (sub) =>
              classesBySubject.has(sub.id) &&
              classesBySubject.get(sub.id)?.length,
          )}
          classesBySubject={classesBySubject}
          map={map}
          setMap={setMap}
          isValid={stepsIsValid[0]}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Alocações',
      content: (
        <AllocationReuseModalSecondStep
          buildings={buildings}
          map={map}
          allocationMap={allocationMap}
          setAllocationMap={setAllocationMap}
          getAllocationOptions={getAllocationOptions}
          allocationReuseResponse={allocationReuseResponse}
          setAllocationReuseResponse={setAllocationReuseResponse}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          mustRefetch={mustRefetch}
          setMustRefetch={setMustRefetch}
          isValid={stepsIsValid[1]}
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
          selectedClasses={
            new Set(Array.from(map.values()).flatMap((val) => val.class_ids))
          }
          selectedSubjects={new Set(map.keys())}
          allocationMap={allocationMap}
        />
      ),
    },
  ];

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  function handleNextClick() {
    if (activeStep < steps.length - 1) {
      if (activeStep == 0) {
        const selectedSubjects = Array.from(map.keys());
        if (selectedSubjects.length == 0) {
          setStepsIsValid((val) => [false, val[1], true]);
          return;
        }
        const invalidSubjects = Array.from(map.values()).filter(
          (val) => val.class_ids.length == 0,
        );
        if (invalidSubjects.length > 0) {
          setStepsIsValid((val) => [false, val[1], true]);
          return;
        }
        setStepsIsValid((val) => [true, val[1], true]);
      }
      if (activeStep == 1) {
        if (!selectedBuilding) {
          setStepsIsValid((val) => [val[0], false, true]);
          return;
        }
        const validSchedules = Array.from(allocationMap.values()).filter(
          (val) => val.classroom_ids.length > 0,
        );
        if (validSchedules.length == 0) {
          setStepsIsValid((val) => [val[0], false, true]);
          return;
        }
        setStepsIsValid((val) => [val[0], true, true]);
      }
      setActiveStep(activeStep + 1);
    }
  }

  function reset() {
    setMap(new Map());
    setAllocationMap(new Map());
    setAllocationReuseResponse(undefined);
    setSelectedBuilding(undefined);
    setLoading(false);
    setStepsIsValid([true, true, true]);
    setActiveStep(0);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleConfirmClick() {
    const inputValues: AllocationMapValue[] = Array.from(
      allocationMap.entries(),
    ).flatMap((entry) => {
      if (entry[1].classroom_ids.length == 0) return [];
      return [
        {
          schedule_id: entry[0],
          classroom_ids: entry[1].classroom_ids,
        },
      ];
    });
    const input: AllocationMapInput = {
      allocation_map: inputValues,
    };
    setLoading(true);
    await applyAllocationMap(input)
      .then((response) => {
        toast('Sucesso!', response.data.message, 'success');
        refetch();
      })
      .catch((error: AxiosErrorResponse) => {
        console.error(error);
        const detail = error.response?.data.detail;
        toast('Erro!', detail || 'Erro desconhecido!', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    handleClose();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMustRefetch(true);
  }, [map]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleClose()}
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
                      Inválido
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
                onClick={() => handleClose()}
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
                    await handleConfirmClick();
                  }}
                  rightIcon={<DownloadIcon />}
                  isDisabled={stepsIsValid.filter((value) => !value).length > 0}
                  isLoading={loading}
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
