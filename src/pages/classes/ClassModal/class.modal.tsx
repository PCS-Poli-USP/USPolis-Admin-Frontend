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

function ClassModal(props: ClassModalProps) {
  const [week_day, setWeekDay] = useState('');
  const [week_days, setWeekDays] = useState<string[]>([]);

  const [start_time, setStartTime] = useState('');
  const [start_times, setStartTimes] = useState<string[]>([]);

  const [end_time, setEndTime] = useState('');
  const [end_times, setEndTimes] = useState<string[]>([]);

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDateIndex, setEditDateIndex] = useState(0);
 

  // useEffect(() => {
  //   if (props.selectedClass) {
  //     classReset({ subject_id: props.selectedClass.subject_id });
  //   }
  // }, [props.selectedClass, classReset]);

  async function handleFirstNextClick(data: ClassFirstForm) {}

  function handleNextClick() {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
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

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setWeekDay(event.target.value);
  }

  function handleDateButton() {
    // if (validator.isInvalidTime(start_time, end_time)) {
    //   setHasTimeError(true);
    // } else setHasTimeError(false);

    // if (validator.isEmpty(week_day)) {
    //   setHasDayError(true);
    // } else setHasDayError(false);

    // if (
    //   validator.isInvalidTime(start_time, end_time) ||
    //   validator.isEmpty(week_day)
    // )
    //   return;

    const newWeekDays = [...week_days];
    const newStarTime = [...start_time];
    const newEndTime = [...end_time];

    if (isEditingDate) {
      newWeekDays[editDateIndex] = week_day;
      newStarTime[editDateIndex] = start_time;
      newEndTime[editDateIndex] = end_time;
    } else {
      newWeekDays.push(week_day);
      newStarTime.push(start_time);
      newEndTime.push(end_time);
    }

    setIsEditingDate(false);
  }

  function handleEditDateButton(index: number): void {
    setStartTime(start_times[index]);
    setEndTime(end_times[index]);
    setWeekDay(week_days[index]);
    setEditDateIndex(index);
    setIsEditingDate(true);
  }

  function handleDeleteDateButton(index: number): void {
    const newWeekDays = [...week_days];
    newWeekDays.splice(index, 1);

    const newStartTimes = [...start_times];
    newStartTimes.splice(index, 1);

    const newEndtimes = [...end_times];
    newEndtimes.splice(index, 1);

    setWeekDays(newWeekDays);
    setStartTimes(newStartTimes);
    setEndTimes(newEndtimes);
  }

  const steps = [
    {
      title: 'Primeiro',
      description: 'Informações',
      content: (
        <ClassModalFirstStep
          isUpdate={false}
          subjects={props.subjects}
          selectedClass={props.selectedClass}
          onNext={handleFirstNextClick}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Horários e Datas',
      content: (
        <ClassModalSecondStep
          isUpdate={false}
          calendars={props.calendars}
          selectedClass={props.selectedClass}
          onNext={handleFirstNextClick}
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
