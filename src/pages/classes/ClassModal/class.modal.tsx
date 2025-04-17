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
  Text,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
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
import { yupResolver } from '@hookform//resolvers/yup';
import {
  classSecondDefaultValues,
  classSecondSchema,
} from './Steps/Second/class.modal.steps.second.form';
import { ClassThirdForm } from './Steps/Third/class.modal.steps.third.interface';
import {
  classThirdDefaultValues,
  classThirdSchema,
} from './Steps/Third/class.modal.steps.third.form';
import {
  ClassBase,
  CreateClass,
  UpdateClass,
} from '../../../models/http/requests/class.request.models';
import {
  CreateSchedule,
  UpdateSchedule,
} from '../../../models/http/requests/schedule.request.models';
import useClasses from '../../../hooks/classes/useClasses';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import { ClassFourthForm } from './Steps/Fourth/class.modal.steps.fourth.interface';
import {
  classFourthDefaultValues,
  classFourthchema,
} from './Steps/Fourth/class.modal.steps.fourth.form';
import ClassModalFifthStep from './Steps/Fifth/class.modal.steps.fifth';
import ClassModalFourthStep from './Steps/Fourth/class.modal.steps.fourth';

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

  const fourthForm = useForm<ClassFourthForm>({
    defaultValues: classFourthDefaultValues,
    resolver: yupResolver(classFourthchema),
  });

  const { createClass, updateClass } = useClasses(false);

  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [stepsIsValid, setStepsIsValid] = useState<
    [boolean, boolean, boolean, boolean, boolean]
  >([false, false, false, true, true]);

  function getFormatedScheduleData(): CreateSchedule[] | UpdateSchedule[] {
    return schedules.map((schedule) => {
      const formated: UpdateSchedule = {
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        recurrence: schedule.recurrence,
        week_day:
          schedule.week_day || schedule.week_day === 0 // WeekDay can be zero
            ? Number(schedule.week_day)
            : undefined,
        all_day: false,
        allocated: schedule.allocated ? schedule.allocated : false,
        dates: schedule.dates,
        month_week: schedule.month_week
          ? Number(schedule.month_week)
          : undefined,
        classroom_id: schedule.classroom_id,
      };
      return formated;
    });
  }

  function getClassData(): CreateClass | UpdateClass {
    const firstData = firstForm.getValues();
    const secondData = secondForm.getValues();
    const fourthData = fourthForm.getValues();

    const baseData: ClassBase = {
      calendar_ids: secondData.calendar_ids,
      code: firstData.code,
      type: firstData.type,
      professors: firstData.professors,
      vacancies: firstData.vacancies,
      air_conditionating: fourthData.air_conditionating,
      accessibility: fourthData.accessibility,
      projector: fourthData.projector,
      ignore_to_allocate: fourthData.ignore_to_allocate,
      start_date: secondData.start_date,
      end_date: secondData.end_date,
    };

    if (props.isUpdate) {
      const updatedData: UpdateClass = {
        ...baseData,
        subject_id: Number(firstData.subject_id),
        schedules_data: getFormatedScheduleData(),
      };
      return updatedData;
    }
    const data: CreateClass = {
      ...baseData,
      subject_id: Number(firstData.subject_id),
      schedules_data: getFormatedScheduleData(),
    };
    return data;
  }

  async function handleFirstNextClick() {
    const { trigger } = firstForm;
    const isValid = await trigger();
    setStepsIsValid((prev) => [isValid, prev[1], prev[2], prev[3], prev[4]]);
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleSecondNextClick() {
    const { trigger } = secondForm;
    const isValid = await trigger();
    setStepsIsValid((prev) => [prev[0], isValid, prev[2], prev[3], prev[4]]);
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleThirdNextClick() {
    const { trigger } = thirdForm;
    const isValid = await trigger();
    setStepsIsValid((prev) => [
      prev[0],
      prev[1],
      schedules.length > 0 ? isValid : false,
      prev[3],
      prev[4],
    ]);
    if (!isValid) return;
    if (schedules.length === 0) return;
    setActiveStep(activeStep + 1);
  }

  async function handleFourthNextClick() {
    const { trigger } = fourthForm;
    const isValid = await trigger();
    setStepsIsValid((prev) => [prev[0], prev[1], prev[2], isValid, prev[4]]);
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleNextClick() {
    if (activeStep === 0) await handleFirstNextClick();
    if (activeStep === 1) await handleSecondNextClick();
    if (activeStep === 2) await handleThirdNextClick();
    if (activeStep === 3) await handleFourthNextClick();
  }

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  async function handleSaveClick() {
    const data = getClassData();
    if (props.isUpdate && props.selectedClass) {
      await updateClass(props.selectedClass.id, data as UpdateClass);
    } else if (!props.isUpdate) {
      await createClass(data as CreateClass);
    }
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    firstForm.reset(classFirstDefaultValues);
    secondForm.reset(classSecondDefaultValues);
    thirdForm.reset(classThirdDefaultValues);
    setSchedules([]);
    setActiveStep(0);
    props.onClose();
  }

  function loadFourthFormFromClass(data: ClassResponse) {
    fourthForm.reset({
      ignore_to_allocate: data.ignore_to_allocate,
      projector: data.projector,
      accessibility: data.accessibility,
      air_conditionating: data.air_conditionating,
    });
  }

  function loadSecondFormFromClass(data: ClassResponse) {
    secondForm.reset({
      start_date: data.start_date,
      end_date: data.end_date,
      calendar_ids: data.calendar_ids,
    });
  }

  function loadFirstFormFromClass(data: ClassResponse) {
    firstForm.reset({
      subject_id: data.subject_id,
      code: data.code,
      type: data.type,
      vacancies: data.vacancies,
      professors: data.professors,
    });
  }

  function loadFormsFromClass(data: ClassResponse) {
    loadFirstFormFromClass(data);
    loadSecondFormFromClass(data);
    loadFourthFormFromClass(data);
  }

  function loadSchedulesFromClass(data: ClassResponse) {
    const newSchedules: ScheduleData[] = data.schedules.map((schedule) => ({
      recurrence: schedule.recurrence,
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      week_day: schedule.week_day,
      dates: schedule.occurrences
        ? schedule.occurrences.map((occur) => occur.date)
        : undefined,
      allocated: schedule.allocated,
      classroom_id: schedule.classroom_id,
    }));
    setSchedules(newSchedules);
  }

  function loadSelectedClass(data: ClassResponse) {
    loadSchedulesFromClass(data);
    loadFormsFromClass(data);
  }

  useEffect(() => {
    if (props.selectedClass) {
      loadSelectedClass(props.selectedClass);
      setStepsIsValid([true, true, true, true, true]);
    } else setStepsIsValid([false, false, false, true, true]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedClass]);

  const steps = [
    {
      title: 'Primeiro',
      description: 'Informações',
      content: (
        <ClassModalFirstStep
          isUpdate={props.isUpdate}
          form={firstForm}
          subjects={props.subjects}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Datas',
      content: (
        <ClassModalSecondStep
          form={secondForm}
          thirdForm={thirdForm}
          isUpdate={props.isUpdate}
          calendars={props.calendars}
          onNext={handleSecondNextClick}
        />
      ),
    },
    {
      title: 'Terceiro',
      description: 'Horários',
      content: (
        <ClassModalThirdStep
          form={thirdForm}
          secondForm={secondForm}
          isUpdate={props.isUpdate}
          schedules={schedules}
          setSchedules={setSchedules}
          onNext={handleThirdNextClick}
        />
      ),
    },
    {
      title: 'Quarto',
      description: 'Preferências',
      content: (
        <ClassModalFourthStep
          form={fourthForm}
          isUpdate={props.isUpdate}
          onNext={handleFirstNextClick}
        />
      ),
    },
    {
      title: 'Quinto',
      description: 'Revisão',
      content: (
        <ClassModalFifthStep
          data={{
            first: firstForm.getValues(),
            second: secondForm.getValues(),
            third: thirdForm.getValues(),
            fourth: fourthForm.getValues(),
          }}
          calendars={props.calendars}
          subjects={props.subjects}
          schedules={schedules}
          isUpdate={props.isUpdate}
          selectedClass={props.selectedClass}
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
          {props.isUpdate
            ? `Editar Turma - ${steps[activeStep].description}`
            : `Cadastrar Turma - ${steps[activeStep].description}`}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={10}>
          <VStack w={'full'}>
            <Stepper size='lg' index={activeStep} alignItems={'center'}>
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

export default ClassModal;
