import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  IconButton,
  Input as ChakraInput,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select as ChakraSelect,
  Text,
  Tooltip,
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
  BsPersonCheckFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { CalendarIcon } from '@chakra-ui/icons';

import { useEffect, useState } from 'react';
import { weekDaysFormatter } from 'utils/classes/classes.formatter';
import { Input, Select } from 'components/common';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ClassForm,
  ClassModalProps,
  ClassScheduleForm,
} from './class.modal.interface';
import {
  scheduleDefaultValues,
  scheduleSchema,
} from './class.modal.schedule.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { classDefaultValues, classSchema } from './class.modal.form';
import { ClassType } from 'utils/enums/classes.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import ClassModalStepsFirst from './Steps/First/class.modal.steps.first';
import ClassModalFirstStep from './Steps/First/class.modal.steps.first';

const steps = [
  { title: 'Primeiro', description: 'Informações da Turma' },
  { title: 'Segundo', description: 'Horários da Turma' },
  { title: 'Terceiro', description: 'Preferências da Turma' },
];

function ClassModal(props: ClassModalProps) {
  const [professor, setProfessor] = useState('');
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [professors, setProfessors] = useState<string[]>([]);
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);

  const [week_day, setWeekDay] = useState('');
  const [week_days, setWeekDays] = useState<string[]>([]);

  const [start_time, setStartTime] = useState('');
  const [start_times, setStartTimes] = useState<string[]>([]);

  const [end_time, setEndTime] = useState('');
  const [end_times, setEndTimes] = useState<string[]>([]);

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDateIndex, setEditDateIndex] = useState(0);
  const [buildingName, setBuildingName] = useState('');

  const classForm = useForm<ClassForm>({
    defaultValues: classDefaultValues,
    resolver: yupResolver(classSchema),
  });

  // const scheduleForm = useForm<ClassScheduleForm>({
  //   defaultValues: scheduleDefaultValues,
  //   resolver: yupResolver(scheduleSchema),
  // });

  const {
    trigger: classTrigger,
    reset: classReset,
    getValues: classGetValues,
    clearErrors: classClearErrors,
  } = classForm;
  // const {
  //   trigger: scheduleTrigger,
  //   reset: scheduleReset,
  //   getValues: scheduleGetValues,
  //   clearErrors: scheduleClearErrors,
  // } = scheduleForm;

  useEffect(() => {
    if (props.selectedClass) {
      classReset({ subject_id: props.selectedClass.subject_id });
    }
  }, [props.selectedClass, classReset]);

  function handleSaveClick() {
    props.onClose();
  }

  function handleCloseModal() {
    props.onClose();
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setWeekDay(event.target.value);
  }

  const handleProfessorButton = () => {
    // if (validator.isInvalidProfessor(professor)) {
    //   setHasProfessorError(true);
    //   return;
    // } else setHasProfessorError(false);

    const names: string[] = [...professors];
    if (!isEditingProfessor) {
      names.push(professor);
    } else {
      names[editProfessorIndex] = professor;
    }
    setProfessor('');
    setIsEditingProfessor(false);
  };

  function handleProfessorInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter') handleProfessorButton();
  }

  function handleEditProfessorButton(index: number) {
    setIsEditingProfessor(true);
    setEditProfessorIndex(index);
    setProfessor(professors[index]);
  }

  function handleDeleteProfessorButton(index: number) {
    const newProfessors = [...professors];
    newProfessors.splice(index, 1);
    setProfessors(newProfessors);
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

  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size={'3xl'}
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cadastrar uma turma</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={10}>
          <VStack>
            <Stepper size='lg' index={activeStep}>
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

            <Stepper size={'lg'} index={activeStep}>
              <ClassModalFirstStep
                title={steps[0].title}
                description={steps[0].description}
                subjects={props.subjects}
                selectedClass={props.selectedClass}
              />
            </Stepper>
          </VStack>

          {/* <VStack spacing='20px' alignItems='start'> */}
          {/* <Select
              label={'Dia da semana'}
              name={'Teste'}
              placeholder='Escolha o dia da semana'
              value={week_day}
              options={WeekDay.getValues().map((value: WeekDay) => ({
                label: WeekDay.translate(value),
                value: value,
              }))}
            />

            <FormLabel>Horário da aula</FormLabel>
            <HStack spacing='5px'>
              <FormLabel>Início</FormLabel>
              <Input
                label={'Início'}
                name={'aaa'}
                placeholder='Horario de início da disciplina'
                type='time'
                value={start_time}
              />
              <FormLabel>Fim</FormLabel>
              <Input
                label={'Fim'}
                name={'aaa'}
                placeholder='Horário de encerramento da disciplina'
                type='time'
                value={end_time}
              />
            </HStack>

            <FormControl>
              <Button type='submit' onClick={handleDateButton}>
                {isEditingDate ? 'Editar Horário' : 'Adicionar horário'}
              </Button>
            </FormControl>

            <Text as='b' fontSize='lg'>
              Horários adicionados:
            </Text>
            {week_days.length > 0 ? (
              <List spacing={3}>
                {week_days.map((week_day, index) => (
                  <HStack key={index}>
                    <CalendarIcon />
                    <Text>
                      {` ${weekDaysFormatter(week_day)}, ${
                        start_time[index]
                      } às ${end_time[index]}`}{' '}
                    </Text>
                    <Tooltip label='Editar'>
                      <IconButton
                        colorScheme='yellow'
                        size='sm'
                        variant='ghost'
                        aria-label='editar-data'
                        icon={<BsFillPenFill />}
                        onClick={() => handleEditDateButton(index)}
                      />
                    </Tooltip>

                    <Tooltip label='Remover'>
                      <IconButton
                        colorScheme='red'
                        size='sm'
                        variant='ghost'
                        aria-label='remover-data'
                        icon={<BsFillTrashFill />}
                        onClick={() => handleDeleteDateButton(index)}
                      />
                    </Tooltip>
                  </HStack>
                ))}
              </List>
            ) : (
              <Alert status='error' fontSize='sm' mb={4}>
                <AlertIcon />
                Nenhum horário adicionado
              </Alert>
            )}

            <Text as='b' fontSize='xl'>
              Preferências
            </Text>

            <HStack>
              <Checkbox isChecked={true}>Acessibilidade</Checkbox>
              <Checkbox>Ar Condicionado</Checkbox>
              <Checkbox>Projetor</Checkbox>
            </HStack>
            <Checkbox isChecked={true}>
              Ignorar para alocação automática
            </Checkbox> */}
          {/* </VStack> */}
        </ModalBody>

        <ModalFooter>
          <VStack width={'full'}>
            {true ? (
              <Alert status='error' fontSize='sm'>
                <AlertIcon />
                Fomulário inválido, corrija os campos inválidos
              </Alert>
            ) : undefined}
            <HStack spacing='10px' alignSelf={'flex-end'}>
              <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
                Salvar
              </Button>
              <Button onClick={handleCloseModal}>Cancelar</Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ClassModal;
