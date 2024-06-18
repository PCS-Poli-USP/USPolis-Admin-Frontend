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
import { ClassModalProps, ScheduleData } from './class.modal.interface';
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
import ClassModalFourthStep from './Steps/Fourth/class.modal.steps.fourth';
import { ClassThirdForm } from './Steps/Third/class.modal.steps.third.interface';
import {
  classThirdDefaultValues,
  classThirdSchema,
} from './Steps/Third/class.modal.steps.third.form';
import {
  CreateClass,
  UpdateClass,
} from 'models/http/requests/class.request.models';
import {
  CreateSchedule,
  UpdateSchedule,
} from 'models/http/requests/schedule.request.models';
import useClasses from 'hooks/useClasses';
import { DayTime } from 'models/common/common.models';

function ClassModal(props: ClassModalProps) {
  const firstForm = useForm<ClassFirstForm>({
    defaultValues: classFirstDefaultValues,
    resolver: yupResolver(classFirstSchema),
  });

  const secondForm = useForm<ClassSecondForm>({
    defaultValues: classSecondDefaultValues,
    resolver: yupResolver(classSecondSchema),
  });

  const thirdForm = useForm<ClassThirdForm>({
    defaultValues: classThirdDefaultValues,
    resolver: yupResolver(classThirdSchema),
  });

  const { createClass, updateClass } = useClasses();

  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  function getFormatedScheduleData(): CreateSchedule[] | UpdateSchedule[] {
    const thirdData = thirdForm.getValues();

    return schedules.map((schedule) => {
      const formated: UpdateSchedule = {
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        start_time: DayTime.fromString(schedule.start_time),
        end_time: DayTime.fromString(schedule.end_time),
        recurrence: schedule.recurrence,
        week_day: schedule.week_day,
        all_day: false,
        allocated: false,
        skip_exceptions: thirdData.skip_exceptions,
        dates: schedule.dates,
      };
      return formated;
    });
  }

  function getClassData(): CreateClass | UpdateClass {
    const firstData = firstForm.getValues();
    const secondData = secondForm.getValues();
    const thirdData = thirdForm.getValues();

    const data: CreateClass = {
      subject_id: Number(firstData.subject_id),
      calendar_ids: secondData.calendar_ids,
      code: firstData.code,
      type: firstData.type,
      professors: firstData.professors,
      vacancies: firstData.vacancies,
      subscribers: firstData.subscribers,
      pendings: firstData.pendings,
      air_conditionating: thirdData.air_conditionating,
      accessibility: thirdData.accessibility,
      projector: thirdData.projector,
      ignore_to_allocate: thirdData.ignore_to_allocate,
      schedules_data: getFormatedScheduleData(),
      start_date: secondData.start_date,
      end_date: secondData.end_date,
    };
    return data;
  }

  async function handleFirstNextClick() {
    const { trigger } = firstForm;
    const isValid = await trigger();
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleSecondNextClick() {
    const { trigger } = secondForm;
    const isValid = await trigger();
    if (!isValid) return;
    if (schedules.length === 0) return;
    setActiveStep(activeStep + 1);
  }

  async function handleThirdNextClick() {
    const { trigger } = thirdForm;
    const isValid = await trigger();
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  function handleNextClick() {
    if (activeStep === 0) handleFirstNextClick();
    if (activeStep === 1) handleSecondNextClick();
    if (activeStep === 2) handleThirdNextClick();
  }

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  async function handleSaveClick() {
    const data = getClassData();
    console.log(data);
    if (props.isUpdate && props.selectedClass) {
      await updateClass(props.selectedClass.id, data as UpdateClass);
    } else {
      await createClass(data as CreateClass);
    }
  }

  function handleCloseModal() {
    firstForm.reset(classFirstDefaultValues);
    secondForm.reset(classSecondDefaultValues);
    thirdForm.reset(classThirdDefaultValues);
    setSchedules([]);
    setActiveStep(0);
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
          schedules={schedules}
          setSchedules={setSchedules}
          selectedClass={props.selectedClass}
        />
      ),
    },
    {
      title: 'Terceiro',
      description: 'Preferências',
      content: (
        <ClassModalThirdStep
          form={thirdForm}
          isUpdate={false}
          subjects={props.subjects}
          selectedClass={props.selectedClass}
          onNext={handleFirstNextClick}
        />
      ),
    },
    {
      title: 'Quarto',
      description: 'Revisão',
      content: (
        <ClassModalFourthStep
          data={{
            first: firstForm.getValues(),
            second: secondForm.getValues(),
            third: thirdForm.getValues(),
          }}
          calendars={props.calendars}
          subjects={props.subjects}
          schedules={schedules}
          isUpdate={false}
          selectedClass={props.selectedClass}
          onNext={handleFirstNextClick}
          moveTo={(index) => setActiveStep(index)}
        />
      ),
    },
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
      size={'5xl'}
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
                <Step key={index}>
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
