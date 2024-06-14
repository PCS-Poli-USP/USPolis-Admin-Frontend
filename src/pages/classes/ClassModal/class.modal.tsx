import {
  Alert,
  AlertIcon,
  Button,
  VStack,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stepper,
  useSteps,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { useState } from 'react';
import { ClassModalProps } from './class.modal.interface';
import ClassModalFirstStep from './Steps/First/class.modal.steps.first';
import { ClassFirstForm } from './Steps/First/class.modal.steps.first.interface';
import ClassModalSecondStep from './Steps/Second/class.modal.steps.second';
import ClassModalThirdStep from './Steps/Third/class.modal.steps.third';
import { ClassSecondForm } from './Steps/Second/class.modal.steps.second.interface';
import { useForm } from 'react-hook-form';
import {
  classFirstDefaultValues,
  classFirstSchema,
} from './Steps/First/class.modal.steps.first.form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  classSecondDefaultValues,
  classSecondSchema,
} from './Steps/Second/class.modal.steps.second.form';

function ClassModal(props: ClassModalProps) {
  const firstForm = useForm<ClassFirstForm>({
    defaultValues: classFirstDefaultValues,
    resolver: yupResolver(classFirstSchema),
  });

  const secondForm = useForm<ClassSecondForm>({
    defaultValues: classSecondDefaultValues,
    resolver: yupResolver(classSecondSchema),
  });

  async function handleFirstNextClick() {
    const { trigger, getValues } = firstForm;
    const isValid = await trigger();
    if (!isValid) return;
    const values = getValues();
    setActiveStep(activeStep + 1);
  }

  function handleSecondNextClick(data: ClassSecondForm) {}

  function handleNextClick() {
    if (activeStep === 0) handleFirstNextClick();
  }

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  function handleSaveClick() {
    props.onClose();
  }

  function handleCloseModal() {
    props.onClose();
  }

  const steps = [
    {
      title: 'Primeiro',
      description: 'Informações',
      content: (
        <ClassModalFirstStep
          isUpdate={false}
          form={firstForm}
          subjects={props.subjects}
          selectedClass={props.selectedClass}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Horários e Datas',
      content: (
        <ClassModalSecondStep
          form={secondForm}
          isUpdate={false}
          calendars={props.calendars}
          selectedClass={props.selectedClass}
        />
      ),
    },
    {
      title: 'Terceiro',
      description: 'Preferências',
      content: (
        <ClassModalThirdStep
          isUpdate={false}
          subjects={props.subjects}
          selectedClass={props.selectedClass}
          onNext={handleFirstNextClick}
        />
      ),
    },
    { title: 'Quarto', description: 'Finalizar', content: undefined },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size={'4xl'}
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Cadastrar uma turma - {`${steps[activeStep].description}`}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={10}>
          <VStack>
            <Stepper size='lg' index={activeStep} alignItems={'start'}>
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
                  onClick={handleSaveClick}
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

export default ClassModal;
