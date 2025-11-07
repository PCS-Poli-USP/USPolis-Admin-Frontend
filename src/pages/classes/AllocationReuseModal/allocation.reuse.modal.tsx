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
import { useState } from 'react';
import AllocationReuseModalFirstStep from './Steps/First/allocation.reuse.modal.first.step';
import { SubjectResponse } from '../../../models/http/responses/subject.response.models';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import AllocationReuseModalSecondStep from './Steps/Second/allocation.reuse.second.step';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import AllocationReuseModalThirdStep from './Steps/Third/allocation.reuse.modal.third.step';

interface AllocationReuseModalProps extends ModalProps {
  data?: AllocationReuseResponse;
  subjects: SubjectResponse[];
  classes: ClassResponse[];
  buildings: BuildingResponse[];
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
}: AllocationReuseModalProps) {
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

  console.log('SubMap: ', map);
  console.log('Alloc', allocationMap);

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

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [stepsIsValid, setStepsIsValid] = useState<[boolean, boolean]>([
    true,
    true,
  ]);

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  function handleNextClick() {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                onClick={onClose}
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
                  onClick={() => {}}
                  rightIcon={<DownloadIcon />}
                  isDisabled={stepsIsValid.filter((value) => !value).length > 0}
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
