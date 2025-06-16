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

interface AllocationReuseModalProps extends ModalProps {
  subjects: SubjectResponse[];
  classes: ClassResponse[];
  buildings: BuildingResponse[];
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
  const [allocationMap, setAllocationMap] = useState<Map<number, number[]>>(
    new Map(),
  );
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

  const steps = [
    {
      title: 'Primeiro',
      description: 'Disciplinas e Turmas',
      content: (
        <AllocationReuseModalFirstStep
          subjects={subjects}
          classesBySubject={classesBySubject}
          map={map}
          setMap={setMap}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
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
    const scheduleIds = new Array<number>();
    allocationMap.values().forEach((ids) => scheduleIds.push(...ids));
    const isValid = scheduleIds.length > 0;
    setStepsIsValid([stepsIsValid[0], isValid]);

    if (!scheduleIds.length) {
      setStepsInvalidText([
        stepsInvalidText[0],
        'Selecione ao menos uma alocação',
      ]);
    }
    if (scheduleIds.length) {
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
                  onClick={() => {
                    const isValid = validateSteps();
                    if (!isValid) return;
                  }}
                  rightIcon={<DownloadIcon />}
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
