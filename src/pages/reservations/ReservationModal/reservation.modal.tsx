import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useSteps,
  VStack,
} from '@chakra-ui/react';
import { ReservationModalProps } from './reservation.modal.interface';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReservationFirstForm } from './Steps/First/reservation.modal.steps.first.interface';
import {
  firstDefaultValues,
  firstSchema,
} from './Steps/First/reservation.modal.steps.first.form';
import { ReservationSecondForm } from './Steps/Second/reservation.modal.steps.second.interface';
import {
  secondDefaultValues,
  secondSchema,
} from './Steps/Second/reservation.modal.steps.second.form';
import ReservationModalFirstStep from './Steps/First/reservation.modal.steps.first';
import ReservationModalSecondStep from './Steps/Second/reservation.modal.steps.second';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import useReservations from '../../../hooks/reservations/useReservations';
import {
  CreateReservation,
  UpdateReservation,
} from '../../../models/http/requests/reservation.request.models';
import { useEffect, useState } from 'react';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { useDateCalendarPicker } from '../../../components/common/DateCalendarPicker';
import {
  CreateExam,
  UpdateExam,
} from '../../../models/http/requests/exam.request.models';
import {
  CreateEvent,
  UpdateEvent,
} from '../../../models/http/requests/event.request.models';
import {
  CreateMeeting,
  UpdateMeeting,
} from '../../../models/http/requests/meeting.request.models';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import useExams from '../../../hooks/exams/useExams';

function ReservationModal(props: ReservationModalProps) {
  const firstForm = useForm<ReservationFirstForm>({
    defaultValues: firstDefaultValues,
    resolver: yupResolver(firstSchema),
  });

  const secondForm = useForm<ReservationSecondForm>({
    defaultValues: secondDefaultValues,
    resolver: yupResolver(secondSchema),
  });

  const [stepsIsValid, setStepsIsValid] = useState<[boolean, boolean]>([
    false,
    false,
  ]);

  const { loading, createReservation, updateReservation } =
    useReservations(false);
  const { createExam } = useExams();

  const [dates, setDates] = useState<string[]>([]);
  const calendarPicker = useDateCalendarPicker();

  type ReservationCreateData = CreateExam | CreateEvent | CreateMeeting;
  type ReservationUpdateData = UpdateExam | UpdateEvent | UpdateMeeting;

  function getReservationData(): ReservationCreateData | ReservationUpdateData {
    const firstData = firstForm.getValues();
    const secondData = secondForm.getValues();
    let data: ReservationCreateData | ReservationUpdateData = {
      title: firstData.title,
      type: firstData.type,
      reason: firstData.reason,
      classroom_id: secondData.classroom_id,
      schedule_data: {
        reservation_id: props.selectedReservation
          ? props.selectedReservation.id
          : undefined,
        classroom_id: secondData.classroom_id,
        start_date: secondData.start_date,
        end_date: secondData.end_date,
        start_time: secondData.start_time,
        end_time: secondData.end_time,
        recurrence: secondData.recurrence,
        week_day:
          secondData.week_day || secondData.week_day === 0 // WeekDay can be zero
            ? Number(secondData.week_day)
            : undefined,
        month_week: secondData.month_week
          ? Number(secondData.month_week)
          : undefined,
        dates: dates.length > 0 ? dates : undefined,
        all_day: false,
      },
    };
    const type = firstData.type;
    if (type === ReservationType.EVENT) {
      data = {
        ...data,
        link: firstData.link,
        event_type: firstData.event_type,
      };
    }
    if (type === ReservationType.MEETING) {
      data = {
        ...data,
        link: firstData.link,
      };
    }
    if (type === ReservationType.EXAM) {
      if (!firstData.subject_id) {
        throw new Error('Subject ID are required for Exam reservations');
      }
      data = {
        ...data,
        subject_id: firstData.subject_id,
        class_ids: firstData.class_ids,
        schedule_data: {
          ...data.schedule_data,
          labels: secondData.labels,
        },
      } as CreateExam | UpdateExam;
    }

    if (props.isUpdate) {
      return data as UpdateReservation;
    }
    return data as CreateReservation;
  }

  function handleCloseModal() {
    firstForm.reset(firstDefaultValues);
    secondForm.reset(secondDefaultValues);
    setActiveStep(0);
    setDates([]);
    props.onClose();
  }

  async function handleFirstNextClick() {
    const { trigger } = firstForm;
    const isValid = await trigger();
    setStepsIsValid([isValid, stepsIsValid[1]]);
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleSecondNextClick() {
    const isValidFirst = await firstForm.trigger();
    const { trigger, getValues } = secondForm;
    const isValidSecond = await trigger();
    setStepsIsValid(() => [isValidFirst, isValidSecond]);
    if (!isValidFirst) return;
    if (!isValidSecond) return;

    if (getValues('recurrence') !== Recurrence.CUSTOM && dates.length !== 0)
      return;
    if (getValues('recurrence') === Recurrence.CUSTOM && dates.length === 0)
      return;

    if (getValues('type') === ReservationType.EXAM) {
      const labels = getValues('labels');
      if (!labels) return;
      if (labels.length !== dates.length) return;
    }
    handleSaveClick();
  }

  function handleNextClick() {
    if (activeStep === 0) handleFirstNextClick();
    if (activeStep === 1) handleSecondNextClick();
  }

  function handlePreviousClick() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }

  async function handleSaveClick() {
    const data = getReservationData();
    if (props.isUpdate && props.selectedReservation) {
      if (data.type === ReservationType.EXAM) {
        // await updateExam(props.selectedReservation.id, data as UpdateExam);
      } else {
        await updateReservation(
          props.selectedReservation.id,
          data as UpdateReservation,
        );
      }
    }
    if (!props.isUpdate) {
      if (data.type === ReservationType.EXAM) {
        await createExam(data as CreateExam);
      }
      if (data.type === ReservationType.EVENT) {
        await createReservation(data as CreateReservation);
      }
    }
    props.refetch();
    // handleCloseModal();
  }

  useEffect(() => {
    if (props.selectedReservation) {
      firstForm.reset({
        title: props.selectedReservation.title,
        type: props.selectedReservation.type,
        reason: props.selectedReservation.reason,
      });
      secondForm.reset({
        building_id: props.selectedReservation.building_id,
        classroom_id: props.selectedReservation.classroom_id,
        start_time: props.selectedReservation.schedule.start_time,
        end_time: props.selectedReservation.schedule.end_time,
        start_date: props.selectedReservation.schedule.start_date,
        end_date: props.selectedReservation.schedule.end_date,
        recurrence: props.selectedReservation.schedule.recurrence,
        week_day: props.selectedReservation.schedule.week_day,
        month_week: props.selectedReservation.schedule.month_week,
      });

      setStepsIsValid([true, true]);
      if (props.selectedReservation.schedule.occurrences) {
        const dates = props.selectedReservation.schedule.occurrences.map(
          (occur) => occur.date,
        );
        setDates(dates);
        calendarPicker.setSelectedDays(dates);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const steps = [
    {
      title: 'Primeiro',
      description: 'Informações',
      content: (
        <ReservationModalFirstStep
          isUpdate={props.isUpdate}
          form={firstForm}
          secondForm={secondForm}
          setDates={setDates}
          {...calendarPicker}
          selectedReservation={props.selectedReservation}
          subjects={props.subjects}
          classes={props.classes}
          loading={props.loading}
        />
      ),
    },
    {
      title: 'Segundo',
      description: 'Local e Horários',
      content: (
        <ReservationModalSecondStep
          form={secondForm}
          firstForm={firstForm}
          setDates={setDates}
          isUpdate={props.isUpdate}
          buildings={props.buildings}
          classrooms={props.classrooms}
          selectedReservation={props.selectedReservation}
          initialDate={props.initialDate}
          {...calendarPicker}
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
      onClose={handleCloseModal}
      isOpen={props.isOpen}
      closeOnOverlayClick={false}
      size='6xl'
      isCentered
      scrollBehavior='outside'
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate
            ? `Atualizar Reserva - ${steps[activeStep].description}`
            : `Cadastrar Reserva - ${steps[activeStep].description}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                  onClick={handleNextClick}
                  rightIcon={<DownloadIcon />}
                  isLoading={loading}
                >
                  {loading ? 'Salvando...' : 'Finalizar'}
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

export default ReservationModal;
