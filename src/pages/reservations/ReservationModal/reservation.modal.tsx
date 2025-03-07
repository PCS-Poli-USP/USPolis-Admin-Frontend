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
import useReservations from 'hooks/useReservations';
import {
  CreateReservation,
  UpdateReservation,
} from 'models/http/requests/reservation.request.models';
import { useEffect, useState } from 'react';
import { Recurrence } from 'utils/enums/recurrence.enum';

function ReservationModal(props: ReservationModalProps) {
  const firstForm = useForm<ReservationFirstForm>({
    defaultValues: firstDefaultValues,
    resolver: yupResolver(firstSchema),
  });

  const secondForm = useForm<ReservationSecondForm>({
    defaultValues: secondDefaultValues,
    resolver: yupResolver(secondSchema),
  });

  const { createReservation, updateReservation } = useReservations();

  const [dates, setDates] = useState<string[]>([]);

  function getReservationData(): CreateReservation | UpdateReservation {
    const firstData = firstForm.getValues();
    const secondData = secondForm.getValues();
    const data: UpdateReservation | CreateReservation = {
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
    if (!isValid) return;
    setActiveStep(activeStep + 1);
  }

  async function handleSecondNextClick() {
    const { trigger, getValues } = secondForm;
    const isValid = await trigger();
    if (!isValid) return;

    if (getValues('recurrence') !== Recurrence.CUSTOM && dates.length !== 0)
      return;
    if (getValues('recurrence') === Recurrence.CUSTOM && dates.length === 0)
      return;
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
      await updateReservation(
        props.selectedReservation.id,
        data as UpdateReservation,
      );
    } else if (!props.isUpdate) {
      await createReservation(data as CreateReservation);
    }
    props.refetch();
    handleCloseModal();
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

      if (props.selectedReservation.schedule.occurrences) {
        setDates(
          props.selectedReservation.schedule.occurrences.map(
            (occur) => occur.date,
          ),
        );
      }
    }
  }, [props, firstForm, secondForm]);

  const steps = [
    {
      title: 'Primeiro',
      description: 'Informações',
      content: (
        <ReservationModalFirstStep isUpdate={props.isUpdate} form={firstForm} />
      ),
    },
    {
      title: 'Segundo',
      description: 'Local e Horários',
      content: (
        <ReservationModalSecondStep
          form={secondForm}
          setDates={setDates}
          isUpdate={props.isUpdate}
          buildings={props.buildings}
          classrooms={props.classrooms}
          selectedReservation={props.selectedReservation}
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

export default ReservationModal;
